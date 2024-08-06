#!/bin/bash
# This script sets up the development environment for this blockchain project.

# Exit immediately if a command exits with a non-zero status.
#set -e

# Install npm dependencies
echo "Installing npm dependencies..."
#rm -rf node_modules package-lock.json  #uncomment if you want to clean your previous installation.
npm install --force
npm install --save @pinata/sdk
npm install --save react-dropzone

# Update Foundry and build the smart contracts
echo "Updating Foundry..."
cd contracts/
foundryup

echo "Building smart contracts with Forge..."
forge build

# Clone necessary repositories due to bug libraries...
echo "Cloning OpenZeppelin contracts..."
cd lib/
git clone https://github.com/OpenZeppelin/openzeppelin-contracts.git

echo "Cloning Forge standard library..."
git clone https://github.com/foundry-rs/forge-std.git

echo "Setup complete."
