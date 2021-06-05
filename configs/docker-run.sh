docker build -t rest:latest ..
docker rmi $(docker images -f dangling=true -q) -f || true
docker run -d -p 3000:3000 rest:latest
