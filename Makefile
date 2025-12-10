include .env
export

.PHONY: develop deploy

image-transform-blw:
	 magick kjell-hoglund-min.png -background none -filter Lanczos -define filter:blur=0.85 -resize 150x150^ -gravity center -extent 150x150 -sharpen 0x0.8 -strip  -define png:compression-level=9 PNG32:kjell-hoglund.png

image-transform:
	 magick assets/skrutt-orig.png -background none -filter Lanczos -define filter:blur=0.85 -resize 150x150^ -gravity center -extent 150x150 -sharpen 0x0.8 PNG32:assets/skrutt.png

develop:
	http-server -c-1 -p 8080 .

deploy:
	rsync -av --include "assets/" --include "assets/***" --exclude '*/' . ubuntu@${DEPLOY_IP}:/var/www/html/oted.online --delete
