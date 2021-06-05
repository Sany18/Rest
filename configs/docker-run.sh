docker build -t xyz:latest ..
docker rmi $(docker images -f dangling=true -q) -f || true
docker stop xyz-container || true
docker run -d --name xyz-container -p 80:3000 xyz:latest
