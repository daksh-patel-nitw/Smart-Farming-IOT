/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing a car
type SmartContract struct {
	contractapi.Contract
}

// Car describes basic details of what makes up a car
type Module1Data struct {
	ID string `json:"id" `
	Time uint64 `json:"time" `
	Temperature float32 `json:"temp"`
	PH float32 `json:"ph"`
	Oxygen float32 `json:"oxygen"`
	Turbidity float32 `json:"turbidity"`
	Ammonia float32 `json:"ammonia"`
}

// QueryResult structure used for handling result of query
type QueryResult struct {
	Key    string `json:"Key"`
	Record *Module1Data
}

// InitLedger adds a base set of cars to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	data := []Module1Data{
		Module1Data{ID:"1",Time:1713810436486,Temperature:26,PH:7,Oxygen:3,Turbidity:60,Ammonia:1.2},
Module1Data{ID:"2",Time:1713810736486,Temperature:28,PH:7,Oxygen:4,Turbidity:58,Ammonia:2.3},
Module1Data{ID:"3",Time:1713811036486,Temperature:27,PH:7,Oxygen:5,Turbidity:55,Ammonia:1.1},
Module1Data{ID:"4",Time:1713811336486,Temperature:26,PH:7,Oxygen:2,Turbidity:59,Ammonia:1.4},
Module1Data{ID:"5",Time:1713811636486,Temperature:28,PH:7,Oxygen:3,Turbidity:56,Ammonia:1.3},
Module1Data{ID:"6",Time:1713811936486,Temperature:27,PH:7,Oxygen:4,Turbidity:60,Ammonia:0.8},
Module1Data{ID:"7",Time:1713812236486,Temperature:26,PH:7,Oxygen:5,Turbidity:57,Ammonia:1.5},
Module1Data{ID:"8",Time:1713812536486,Temperature:28,PH:7,Oxygen:3,Turbidity:58,Ammonia:1.2},
Module1Data{ID:"9",Time:1713812836486,Temperature:27,PH:7,Oxygen:4,Turbidity:59,Ammonia:2.3},
Module1Data{ID:"10",Time:1713813136486,Temperature:26,PH:7,Oxygen:5,Turbidity:60,Ammonia:1.1},
Module1Data{ID:"11",Time:1713813436486,Temperature:28,PH:7,Oxygen:2,Turbidity:55,Ammonia:1.4},
Module1Data{ID:"12",Time:1713813736486,Temperature:27,PH:7,Oxygen:3,Turbidity:56,Ammonia:1.3},
Module1Data{ID:"13",Time:1713814036486,Temperature:26,PH:7,Oxygen:4,Turbidity:57,Ammonia:0.8},
Module1Data{ID:"14",Time:1713814336486,Temperature:28,PH:7,Oxygen:5,Turbidity:58,Ammonia:1.5},
Module1Data{ID:"15",Time:1713814636486,Temperature:27,PH:7,Oxygen:3,Turbidity:59,Ammonia:1.2},
Module1Data{ID:"16",Time:1713814936486,Temperature:26,PH:7,Oxygen:4,Turbidity:60,Ammonia:2.3},
Module1Data{ID:"17",Time:1713815236486,Temperature:28,PH:7,Oxygen:5,Turbidity:55,Ammonia:1.1},
Module1Data{ID:"18",Time:1713815536486,Temperature:27,PH:7,Oxygen:2,Turbidity:56,Ammonia:1.4},
Module1Data{ID:"19",Time:1713815836486,Temperature:26,PH:7,Oxygen:3,Turbidity:57,Ammonia:1.3},
Module1Data{ID:"20",Time:1713816136486,Temperature:28,PH:7,Oxygen:4,Turbidity:58,Ammonia:0.8},
Module1Data{ID:"21",Time:1713816436486,Temperature:27,PH:7,Oxygen:5,Turbidity:59,Ammonia:1.5},
Module1Data{ID:"22",Time:1713816736486,Temperature:26,PH:7,Oxygen:3,Turbidity:60,Ammonia:1.2},
Module1Data{ID:"23",Time:1713817036486,Temperature:28,PH:7,Oxygen:4,Turbidity:55,Ammonia:2.3},
Module1Data{ID:"24",Time:1713817336486,Temperature:27,PH:7,Oxygen:5,Turbidity:56,Ammonia:1.1},
Module1Data{ID:"25",Time:1713817636486,Temperature:26,PH:7,Oxygen:2,Turbidity:57,Ammonia:1.4},
Module1Data{ID:"26",Time:1713817936486,Temperature:28,PH:7,Oxygen:3,Turbidity:58,Ammonia:1.3},
Module1Data{ID:"27",Time:1713818236486,Temperature:27,PH:7,Oxygen:4,Turbidity:59,Ammonia:0.8},
Module1Data{ID:"28",Time:1713818536486,Temperature:26,PH:7,Oxygen:5,Turbidity:60,Ammonia:1.5},
Module1Data{ID:"29",Time:1713818836486,Temperature:28,PH:7,Oxygen:3,Turbidity:55,Ammonia:1.2},
Module1Data{ID:"30",Time:1713819136486,Temperature:27,PH:7,Oxygen:4,Turbidity:56,Ammonia:2.3},
	}

	for i, d := range data {
		dataAsBytes, _ := json.Marshal(d)
		err := ctx.GetStub().PutState(strconv.Itoa(i), dataAsBytes)

		if err != nil {
			return fmt.Errorf("Failed to put to world state. %s", err.Error())
		}
	}

	return nil
}

// CreateData adds a new data to the world state with given details
func (s *SmartContract) CreateData(ctx contractapi.TransactionContextInterface, id string,time uint64,temp float32,ph float32,oxygen float32,turbidity float32,ammonia float32) error {
	car := Module1Data{
		ID: id,
		Time: time,
		Temperature: temp,
		PH: ph,
		Oxygen: oxygen,
		Turbidity: turbidity,
		Ammonia: ammonia,
	}

	carAsBytes, _ := json.Marshal(car)

	return ctx.GetStub().PutState(id, carAsBytes)
}

// QueryAllData returns all data found in world state
func (s *SmartContract) QueryAllData(ctx contractapi.TransactionContextInterface) ([]QueryResult, error) {
	startKey := ""
	endKey := ""

	resultsIterator, err := ctx.GetStub().GetStateByRange(startKey, endKey)

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []QueryResult{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		car := new(Module1Data)
		_ = json.Unmarshal(queryResponse.Value, car)

		queryResult := QueryResult{Key: queryResponse.Key, Record: car}
		results = append(results, queryResult)
	}

	return results, nil
}

func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error create fabcar chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting fabcar chaincode: %s", err.Error())
	}
}
