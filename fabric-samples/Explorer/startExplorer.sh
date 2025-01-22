
sudo rm -r organizations

# Step 1: Copy organizations directory
sudo cp -r ../test-network/organizations/ .
sudo chmod -R 777 organizations
# Step 2: Rename the key file to "priv_sk"
# key_path="/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/"
# key_file=$(basename "$key_path")
# sudo cp "$key_path$key_file" "$key_path/priv_sk"
# sudo rm "$key_path$key_file"

key_path="/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/"
key_file=$(basename "$key_path")
sudo cp "$key_path$key_file" "$key_path/priv_sk"
sudo rm "$key_path$key_file"

# Step 3: Bring up Docker containers
docker-compose down --volumes
docker-compose down

docker-compose up -d
