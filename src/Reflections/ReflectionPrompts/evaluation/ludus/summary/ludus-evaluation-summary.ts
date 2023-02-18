import { autoinject, computedFrom } from "aurelia-framework";
import { LudusEvaluation } from "../ludus-evaluation";
import { ApplicationState } from "applicationState";
import { Emotion, EmotionModifier } from "models/prompts";
import { LudusStrategy } from "models/reflectionsApiModels";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class LudusEvaluationSummary extends ReflectionStep {

	radius: number = 90;
	textRadius: number = 75;
	numOfSegments: number = 8;
	segments: Segment[];
	move: string = "M";
	line: string = "L";
	arc: string = `A ${this.radius} ${this.radius} 0 0 0`;
	center: number = 0;
	rotation: string;
	currentRotation: number;
	currentSegment: Segment;
	selectedModifiers: EmotionModifier[];

	constructor(private localParent: LudusEvaluation, private appState: ApplicationState) {
		super();
		this.stepParent = localParent;
	}

	async attached() {
		this.currentSegment = null;
		this.currentRotation = 0;
		this.rotation = null;

		this.numOfSegments = this.appState.emotions.length;
		this.segments = [];
		let degree = 0 - 180 / this.numOfSegments;

		for (let segment = 0; segment < this.numOfSegments; segment++) {
			const emotion = this.appState.emotions[segment];

			const nextDegree = degree + (360 / this.numOfSegments);
			const path = `
				${this.move} ${this.center} ${this.center}
				${this.line} ${this.getCoordinates(degree, this.radius)}
				${this.arc} ${this.getCoordinates(nextDegree, this.radius)}
				${this.line} ${this.center} ${this.center}`;

			const textPath = `${this.move} ${this.getCoordinates(degree, this.textRadius)}
				${this.arc} ${this.getCoordinates(nextDegree, this.textRadius)}`;

			const rotation = segment * (360 / this.numOfSegments);

			this.segments.push({
				pathString: path,
				emotion: emotion,
				textPath: textPath,
				rotation: rotation,
				active: false,
				modifiers: [],
				numOfPrompts: emotion.modifiers.length,
				lastIndex: -1
			});

			degree = nextDegree;
		}

		this.selectedModifiers = this.segments.reduce((prev, curr) => {
			return prev.concat(curr.emotion.modifiers);
		}, [])
			.filter(x => x.active)

	}

	saveStep() {
		this.localParent.model.learningExperience.enjoyment = this.getEmotionForModel(this.appState.emotionsStrings.enjoyment);
		this.localParent.model.learningExperience.hope = this.getEmotionForModel(this.appState.emotionsStrings.hope);
		this.localParent.model.learningExperience.pride = this.getEmotionForModel(this.appState.emotionsStrings.pride);
		this.localParent.model.learningExperience.anger = this.getEmotionForModel(this.appState.emotionsStrings.anger);
		this.localParent.model.learningExperience.anxiety = this.getEmotionForModel(this.appState.emotionsStrings.anxiety);
		this.localParent.model.learningExperience.shame = this.getEmotionForModel(this.appState.emotionsStrings.shame);
		this.localParent.model.learningExperience.hopelessness = this.getEmotionForModel(this.appState.emotionsStrings.hopelessness);
		this.localParent.model.learningExperience.boredom = this.getEmotionForModel(this.appState.emotionsStrings.boredom);
	}

	getEmotionForModel(emotion: Emotion): LudusStrategy {
		const modifier = this.selectedModifiers.find(x => x.emotion == emotion.text);
		if (modifier == null) return null;
		return {
			text: modifier.text,
			modifiers: [{
				name: emotion.text,
				amount: modifier.amount
			}]
		};
	}

	selectSegment(segment: Segment) {
		this.segments.forEach(x => x.active = false);
		this.currentSegment = segment;
		this.currentSegment.active = true;
		let rotation = 0;
		let distance = segment.rotation - this.currentRotation;
		if (distance > 360) {
			distance = distance % 360;
		}
		if (this.currentRotation != null && distance > 180) {
			rotation = distance - 360;
		} else {
			rotation = distance;
		}
		this.currentRotation += rotation;
		this.rotation = `transform: rotate(${this.currentRotation - 180}deg)`;

		if (this.currentSegment.modifiers == null || this.currentSegment.modifiers.length == 0) {
			this.getNextPrompts();
		}
	}

	getCoordinates(degree: number, radius: number): string {
		const x = this.getXCoordinates(degree, radius);
		const y = this.getYCoordinates(degree, radius);
		return `${x} ${y}`
	}

	getXCoordinates(degree: number, radius: number): number {
		const radians = degree * (Math.PI / 180);
		return (radius * Math.sin(radians)) + this.center;
	}

	getYCoordinates(degree: number, radius: number): number {
		const radians = degree * (Math.PI / 180);
		return (radius * Math.cos(radians)) + this.center;
	}

	getNextPrompts() {
		this.currentSegment.modifiers = [];
		let index = this.currentSegment.lastIndex;
		while (this.currentSegment.modifiers.length < 4) {
			++index;
			if (index > (this.currentSegment.numOfPrompts - 1)) {
				index = 0;
			}
			const modifier = this.currentSegment.emotion.modifiers[index];
			if (this.selectedModifiers.some(x => x.text == modifier.text)) {
				modifier.active = true;
			}
			this.currentSegment.modifiers.push(modifier);
		}
		this.currentSegment.lastIndex = index;
	}

	addModifier(modifier: EmotionModifier) {
		this.currentSegment.modifiers.forEach(x => x.active = false);
		modifier.active = true;
		const otherModifierIndex = this.selectedModifiers.findIndex(x => x.emotion == modifier.emotion);
		if (otherModifierIndex != -1) {
			this.removeModifier(otherModifierIndex);
		}
		this.selectedModifiers.push(modifier);
	}

	removeModifier(index: number) {
		this.selectedModifiers[index].active = false;
		this.selectedModifiers.splice(index, 1);
	}

	@computedFrom("selectedModifiers.length")
	get AllowNext(): boolean {
		return this.selectedModifiers != null && this.selectedModifiers.length > 0 && this.selectedModifiers.length <= 4;
	}
}

class Segment {
	pathString: string;
	emotion: Emotion;
	textPath: string;
	rotation: number;
	active: boolean;
	modifiers: EmotionModifier[];
	lastIndex: number;
	numOfPrompts: number;
}