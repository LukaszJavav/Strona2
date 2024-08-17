
docker build. -t Strona2
docker stop Strona2
docker rm Strona2
docker run -d -p 8080:8080 --name=Strona2 Strona2