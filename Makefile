
containers_remove:
	docker remove -f $$(docker ps -aq)

images_remove:
	docker rmi -f $$(docker images -aq)

remove_full: 
	docker rm -f $$(docker ps -aq) && docker rmi $$(docker images -q)

build-decompiler:
	docker build -t logann131/evm-decompiler-rest:0.1.0 .

run-decompiler:
	docker run -p 7639:7639 logann131/evm-decompiler-rest:0.1.0

start: build-decompiler run-decompiler

full-start: remove_full build-decompiler run-decompiler

