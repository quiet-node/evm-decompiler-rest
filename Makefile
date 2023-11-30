SERVER_IMAGE_TAG=logann131/evm-decompiler-rest:0.1.0

### DOCKER ###
containers_remove:
	docker remove -f $$(docker ps -aq)

images_remove:
	docker rmi -f $$(docker images -aq)

remove_full: 
	docker rm -f $$(docker ps -aq) && docker rmi $$(docker images -q)

build-decompiler:
	docker build -t $(SERVER_IMAGE_TAG) .

run-decompiler:
	docker run -p 7639:7639 $(SERVER_IMAGE_TAG)

start-decompiler: build-decompiler run-decompiler

full-start-decompiler: remove_full build-decompiler run-decompiler

push-decompiler: build-decompiler
	docker push $(SERVER_IMAGE_TAG)

### K8S ###

deploy-k8s:
	kubectl start -f ./k8s/deployment.yaml

service-k8s:
	kubectl start -f ./k8s/service.yaml
