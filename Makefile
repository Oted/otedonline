include .env
export

.PHONY: develop deploy

develop:
	http-server -c-1 -p 8080

deploy:
	rsync -av --exclude '*/' . ubuntu@${DEPLOY_IP}:/var/www/html/oted.online