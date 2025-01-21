#include "contiki.h"
#include "httpd-simple.h"
#include "dev/sht11-sensor.h"
#include "dev/light-sensor.h"
#include "dev/leds.h"
#include <stdio.h>

PROCESS(web_sense_process, "Sense Web Demo");
PROCESS(webserver_nogui_process, "Web server");
PROCESS_THREAD(webserver_nogui_process, ev, data)
{
  PROCESS_BEGIN();

  httpd_init();

  while(1) {
    PROCESS_WAIT_EVENT_UNTIL(ev == tcpip_event);
    httpd_appcall(data);
  }

  PROCESS_END();
}
AUTOSTART_PROCESSES(&web_sense_process,&webserver_nogui_process);

#define HISTORY 16
static int temperature[HISTORY];

static int sensors_pos;

/*---------------------------------------------------------------------------*/
static int
get_ph(void)
{
  return (light_sensor.value(LIGHT_SENSOR_PHOTOSYNTHETIC)/7) % 8 + 2;
}
static int
get_h(void)
{
  return (light_sensor.value(LIGHT_SENSOR_PHOTOSYNTHETIC)/7) % 30 + 55;
}
static int
get_m(void)
{
  return (light_sensor.value(LIGHT_SENSOR_PHOTOSYNTHETIC)/7) % 20 + 45;
}
/*---------------------------------------------------------------------------*/
static int
get_temp(void)
{
  return ((sht11_sensor.value(SHT11_SENSOR_TEMP) / 10) - 396) / 10;
}
static int
get_turbudity(void)
{
  //30-80
  return ((light_sensor.value(LIGHT_SENSOR_PHOTOSYNTHETIC)/7) *23 ) % 20 + 20;
}
static int
get_oxygen(void)
{
  //5-6 below 3 is bad
  return ((light_sensor.value(LIGHT_SENSOR_PHOTOSYNTHETIC)/7) % 13)+1;
}
static int
get_ammonia(void)
{
  //0.1 to 2
  return ((light_sensor.value(LIGHT_SENSOR_PHOTOSYNTHETIC)/7) % 5);
}

/* Only one single request at time */
static char buf[256];
static int blen;
#define ADD(...) do {                                                   \
    blen += snprintf(&buf[blen], sizeof(buf) - blen, __VA_ARGS__);      \
  } while(0)


static
PT_THREAD(send_values(struct httpd_state *s))
{
  PSOCK_BEGIN(&s->sout);

  if(strncmp(s->filename, "/index", 6) == 0 ||
     s->filename[1] == '\0') {
    /* Default page: show latest sensor values as text (does not
       require Internet connection to Google for charts). */
    blen = 0;
    ADD("ph:%u Temp:%u turb:%u am:%u ox:%u mo:%u hu:%u",
        get_ph(), get_temp(), get_turbudity(), get_ammonia(), get_oxygen(),get_m(),get_h());
    SEND_STRING(&s->sout, buf);

  } 

  PSOCK_END(&s->sout);
}
/*---------------------------------------------------------------------------*/
httpd_simple_script_t
httpd_simple_get_script(const char *name)
{
  return send_values;
}
/*---------------------------------------------------------------------------*/
PROCESS_THREAD(web_sense_process, ev, data)
{
  static struct etimer timer;
  PROCESS_BEGIN();

  sensors_pos = 0;

  etimer_set(&timer, CLOCK_SECOND * 2);
  SENSORS_ACTIVATE(light_sensor);
  SENSORS_ACTIVATE(sht11_sensor);

  while(1) {
    PROCESS_WAIT_EVENT_UNTIL(etimer_expired(&timer));
    etimer_reset(&timer);

    
    temperature[sensors_pos] = get_temp();
    sensors_pos = (sensors_pos + 1) % HISTORY;
  }

  PROCESS_END();
}
/*---------------------------------------------------------------------------*/
