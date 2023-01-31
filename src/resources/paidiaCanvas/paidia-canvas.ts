import { autoinject } from "aurelia-framework";
import fabric from "fabric/dist/fabric";
import { ComponentHelper } from "utils/componentHelper";
import { log } from "utils/log";

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
		return this.canvas != null
	}

	createCanvas(backgroundImageNo: number) {
		if (this.canvas == null) {
			const canvasValid = this.initCanvas();
			if (!canvasValid) return;
		}

		fabric.Image.fromURL(`images/backgrounds/${backgroundImageNo}.png`, img => {
			img.scaleToWidth(this.canvas.width);
			img.scaleToHeight(this.canvas.height);
			this.canvas.setBackgroundImage(img,
				this.canvas.renderAll.bind(this.canvas)
			);
		});
	}

	addImage(image: number, style: number, type: LudusImages) {
		log.debug("background", this.canvas.backgroundImage)
		fabric.Image.fromURL(`images/cutouts/${style}/${image}.png`, img => {
			img.name = type;
			let oldImage: fabric.Image;
			switch (type) {
				case LudusImages.Learning:
					oldImage = this.learningImage;
					this.learningImage = img;
					break;
				case LudusImages.Practicing:
					oldImage = this.practicingImage;
					this.practicingImage = img;
					break;
				case LudusImages.Extending:
					oldImage = this.extendingImage;
					this.extendingImage = img;
					break;
				case LudusImages.Reviewing:
					oldImage = this.reviewingImage;
					this.reviewingImage = img;
					break;
				default:
					break;
			}

			if (oldImage != null) {
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
			} else {
				img.scaleToWidth(this.canvas.width / ComponentHelper.RandomWholeNumber(2, 5));
				img.scaleToHeight(this.canvas.height / ComponentHelper.RandomWholeNumber(2, 5));

				const x = Math.floor(img.width * img.scaleX);
				const y = Math.floor(img.height * img.scaleY);
				img.set({
					originX: "center",
					originY: "center",
					left: ComponentHelper.RandomWholeNumber(x, this.canvas.width - x),
					top: ComponentHelper.RandomWholeNumber(y, this.canvas.height - y),
					angle: ComponentHelper.RandomWholeNumber(0, 360)
				});
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
			log.debug("canvas", this.canvas)
		});
	}

	preventLeaving(object) {
		if ((object.left - (object.width * object.scaleX / 2) < 0))
			object.left = object.width * object.scaleX / 2;
		if ((object.top - (object.height * object.scaleY / 2) < 0))
			object.top = object.height * object.scaleY / 2;
		if (object.left + (object.width * object.scaleX / 2) > this.canvas.width) {
			const positionX = this.canvas.width - (object.width * object.scaleX / 2);
			object.left = positionX > this.canvas.width / 2 ? positionX : this.canvas.width / 2;
		}
		if (object.top + (object.height * object.scaleY / 2) > this.canvas.height) {
			const positionY = this.canvas.height - (object.height * object.scaleY / 2);
			object.top = positionY > this.canvas.height / 2 ? positionY : this.canvas.height / 2;
		}

		if (object.width * object.scaleX > this.canvas.width) {
			object.scaleX = this.canvas.width / object.width;
		}
		if (object.height * object.scaleY > this.canvas.height) {
			object.scaleY = this.canvas.height / object.height;
		}
	}

	loadCanvas(canvasData: string) {
		if (this.canvas == null) {
			const canvasValid = this.initCanvas();
			if (!canvasValid) return;
		}

		// log.debug("load canvas", canvasData)

		this.canvas.loadFromJSON(canvasData,
		this.canvas.renderAll.bind(this.canvas), (o, object) => {
			// log.debug("o", o)
			// log.debug("object", object)
		});
		log.debug("canvas", this.canvas)
	}

	saveCanvas(): string {
		return this.canvas.toJSON();
	}
}

export enum LudusImages {
	Learning = "Learning",
	Practicing = "Practicing",
	Extending = "Extending",
	Reviewing = "Reviewing"
}