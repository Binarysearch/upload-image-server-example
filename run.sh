(docker container rm server-files -f || true ) &&


docker build --rm -f "Dockerfile" -t server-files:latest .

docker run -p 3001:3001 -e LISTEN_PORT=3001 --name=server-files server-files:latest