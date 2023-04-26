version: '3'

services:
  redis:
    image: redis
    command: redis-server --port 6379
    ports:
      - "6379:6379"
    networks:
      - localhost
    volumes:
      - redis-data:/data

networks:
  localhost

volumes:
  redis-data:
