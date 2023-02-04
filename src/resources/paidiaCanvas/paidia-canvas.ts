import { autoinject } from "aurelia-framework";
import fabric from "fabric";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class PaidiaCanvas {

	learningImage: fabric.Image;
	reviewingImage: fabric.Image;
	practicingImage: fabric.Image;
	extendingImage: fabric.Image;
	canvas: fabric.Canvas;

	attached() {
		this.initCanvas();
	}

	initCanvas(): boolean {
		const ctx = document.getElementById("paidiaPlanning") as HTMLCanvasElement;
		if (ctx == null) return false;

		this.canvas = new fabric.Canvas(ctx);

		return this.canvas != null;
	}

	createCanvas(backgroundImageNo: number) {
		if (this.canvas == null) {
			const canvasValid = this.initCanvas();
			if (!canvasValid) return;
		}

		this.addBackgroundImage(`images/backgrounds/${backgroundImageNo}.png`);
	}

	addBackgroundImage(src: string) {
		fabric.Image.fromURL(src, img => {
			img.scaleToWidth(this.canvas.width);
			img.scaleToHeight(this.canvas.height);
			this.canvas.setBackgroundImage(img,
				this.canvas.renderAll.bind(this.canvas)
			);
		});
	}

	addImage(image: number, style: number, type: PaidiaImages) {
		fabric.Image.fromURL(`images/cutouts/${style}/${image}.png`, img => {
			const oldImage = this.addImageObject(img, type);
			if (oldImage == null) {
				let scale = 0;
				let biggerValue = 1;
				let smallerValue = 1;

				if (Math.abs(this.canvas.width - img.width) > Math.abs(this.canvas.height - img.height)) {
					if (img.width > this.canvas.width) {
						biggerValue = img.width;
						smallerValue = this.canvas.width;
					} else {
						biggerValue = this.canvas.width;
						smallerValue = img.width;
					}
				} else {
					if (img.height > this.canvas.height) {
						biggerValue = img.height;
						smallerValue = this.canvas.height;
					} else {
						biggerValue = this.canvas.height;
						smallerValue = img.height;
					}
				}
				scale = ComponentHelper.RandomWholeNumber(5, Math.floor(smallerValue / biggerValue * 100)) / 100;
				let padding = 0;
				if (img.width > img.height) {
					padding = img.width * scale / 2;
				} else {
					padding = img.height * scale / 2;
				}
				padding += 10;
				img.set({
					originX: "center",
					originY: "center",
					left: ComponentHelper.RandomWholeNumber(padding, this.canvas.width - padding),
					top: ComponentHelper.RandomWholeNumber(padding, this.canvas.height - padding),
					angle: ComponentHelper.RandomWholeNumber(0, 360),
					scaleX: scale,
					scaleY: scale
				});
			} else {
				img.set({
					originX: "center",
					originY: "center",
					left: oldImage.left,
					top: oldImage.top,
					angle: oldImage.angle,
					scaleX: oldImage.scaleX,
					scaleY: oldImage.scaleY
				});
				this.canvas.remove(oldImage);
			}
		});
	}

	addImageObject(img: fabric.Image, type: PaidiaImages): fabric.Image {
		img.name = type;

		let oldImage: fabric.Image;
		switch (type) {
			case PaidiaImages.Learning:
				oldImage = this.learningImage;
				this.learningImage = img;
				break;
			case PaidiaImages.Practicing:
				oldImage = this.practicingImage;
				this.practicingImage = img;
				break;
			case PaidiaImages.Extending:
				oldImage = this.extendingImage;
				this.extendingImage = img;
				break;
			case PaidiaImages.Reviewing:
				oldImage = this.reviewingImage;
				this.reviewingImage = img;
				break;
			default:
				break;
		}

		img.on("selected", () => {
			img.bringToFront();
		});

		img.on("moving", () => {
			this.preventLeaving(img);
		});

		img.on("scaling", () => {
			this.preventLeaving(img);
		});

		this.canvas.add(img);
		return oldImage;
	}

	preventLeaving(obj: fabric.Object) {
		// if object is too big ignore
		const currentHeight = obj.height * obj.scaleX;
		const currentWidth = obj.width * obj.scaleY;
		if (currentHeight > this.canvas.height || currentWidth > this.canvas.width) {
			return;
		}
		obj.setCoords();
		const boundingRect = obj.getBoundingRect();
		// top-left  corner
		if (boundingRect.top < 0 || boundingRect.left < 0) {
			obj.top = Math.max(obj.top, obj.top - boundingRect.top);
			obj.left = Math.max(obj.left, obj.left - boundingRect.left);
		}
		// bot-right corner
		if (boundingRect.top + boundingRect.height > this.canvas.height || boundingRect.left + boundingRect.width > this.canvas.width) {
			obj.top = Math.min(obj.top, this.canvas.height - boundingRect.height + obj.top - boundingRect.top);
			obj.left = Math.min(obj.left, this.canvas.width - boundingRect.width + obj.left - boundingRect.left);
		}
	}

	loadCanvas(canvasDataJson: string) {
		if (this.canvas == null) {
			const canvasValid = this.initCanvas();
			if (!canvasValid) return;
		}

		const canvasData = JSON.parse(canvasDataJson);
		this.canvas.loadFromJSON(canvasData, () => {
			this.addBackgroundImage(canvasData.backgroundImage.src)
			this.canvas.renderAll.bind(this.canvas);

		}, (o, object) => {
			const type = object.name;
			this.addImageObject(object, type);
		})
	}

	saveCanvas(): string {
		return JSON.stringify(this.canvas.toJSON(["name"]));
	}
}

export enum PaidiaImages {
	Learning = "Learning",
	Practicing = "Practicing",
	Extending = "Extending",
	Reviewing = "Reviewing"
}