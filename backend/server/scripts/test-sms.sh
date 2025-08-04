#!/bin/bash

# MealSync SMS Test Script
# This script provides easy curl commands to test SMS functionality

API_BASE="http://localhost:3001"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🍽️  MealSync SMS Test Commands${NC}"
echo "=================================="

# Function to test SMS endpoint
test_sms() {
    echo -e "\n${YELLOW}🚀 Testing SMS endpoint...${NC}"
    echo "Sending test SMS to +255686477074"
    
    curl -X POST \
         -H "Content-Type: application/json" \
         -d '{}' \
         "${API_BASE}/sms/test" | jq '.' 2>/dev/null || echo "Response received (install jq for pretty JSON)"
}

# Function to send custom SMS
send_custom_sms() {
    local phone="$1"
    local message="$2"
    
    if [ -z "$phone" ] || [ -z "$message" ]; then
        echo -e "${RED}Usage: $0 custom <phone_number> <message>${NC}"
        echo "Example: $0 custom +255686477074 \"Hello from MealSync!\""
        return 1
    fi
    
    echo -e "\n${YELLOW}📱 Sending custom SMS...${NC}"
    echo "Phone: $phone"
    echo "Message: $message"
    
    curl -X POST \
         -H "Content-Type: application/json" \
         -d "{\"message\":\"$message\",\"to\":\"$phone\",\"sender\":\"55\"}" \
         "${API_BASE}/sms/send" | jq '.' 2>/dev/null || echo "Response received"
}

# Function to send welcome SMS
send_welcome_sms() {
    local phone="$1"
    local name="$2"
    
    if [ -z "$phone" ] || [ -z "$name" ]; then
        echo -e "${RED}Usage: $0 welcome <phone_number> <user_name>${NC}"
        echo "Example: $0 welcome +255686477074 \"John Doe\""
        return 1
    fi
    
    echo -e "\n${YELLOW}👋 Sending welcome SMS...${NC}"
    echo "Phone: $phone"
    echo "Name: $name"
    
    curl -X POST \
         -H "Content-Type: application/json" \
         -d "{\"phoneNumber\":\"$phone\",\"userName\":\"$name\"}" \
         "${API_BASE}/sms/welcome" | jq '.' 2>/dev/null || echo "Response received"
}

# Function to check server status
check_server() {
    echo -e "\n${YELLOW}🔍 Checking server status...${NC}"
    
    if curl -s "${API_BASE}/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Server is running on ${API_BASE}${NC}"
        curl -s "${API_BASE}/health" | jq '.' 2>/dev/null || curl -s "${API_BASE}/health"
    else
        echo -e "${RED}❌ Server is not running on ${API_BASE}${NC}"
        echo -e "${YELLOW}💡 Start the server with: npm run dev${NC}"
    fi
}

# Main command handler
case "$1" in
    "test")
        check_server
        test_sms
        ;;
    "custom")
        check_server
        send_custom_sms "$2" "$3"
        ;;
    "welcome")
        check_server
        send_welcome_sms "$2" "$3"
        ;;
    "status")
        check_server
        ;;
    *)
        echo -e "\n${GREEN}Available commands:${NC}"
        echo "  $0 test                           - Send test SMS to +255686477074"
        echo "  $0 custom <phone> <message>       - Send custom SMS"
        echo "  $0 welcome <phone> <name>         - Send welcome SMS"
        echo "  $0 status                         - Check server status"
        echo ""
        echo -e "${GREEN}Examples:${NC}"
        echo "  $0 test"
        echo "  $0 custom +255686477074 \"Hello from MealSync!\""
        echo "  $0 welcome +255686477074 \"John Doe\""
        echo "  $0 status"
        echo ""
        echo -e "${YELLOW}💡 Make sure the server is running: npm run dev${NC}"
        ;;
esac
