#!/bin/bash

echo "Waiting for Ollama to be ready..."
sleep 10

echo "Pulling Qwen2.5 model..."
docker exec backend-ollama-1 ollama pull qwen2.5

echo "Verifying model installation..."
docker exec backend-ollama-1 ollama list

echo "Testing Qwen2.5 model..."
docker exec backend-ollama-1 ollama run qwen2.5 "안녕하세요! 간단한 자기소개를 해주세요."

echo "Qwen2.5 model is ready to use!" 