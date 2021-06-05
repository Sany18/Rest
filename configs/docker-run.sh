docker build -t rest:latest .
docker rmi $(docker images -f dangling=true -q) -f
docker run -d rest:latest -p 3000:3000
