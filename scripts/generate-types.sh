#!/bin/bash

# This script generates types for smart contract interactions
# using wagmi-cli

echo "🔄 Generating types for smart contracts with wagmi-cli..."
bun wagmi generate

echo "✅ Types generated correctly" 