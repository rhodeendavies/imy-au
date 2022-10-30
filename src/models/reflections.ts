import { StrategyCategories } from "utils/enums";

export class BaseSystemReflection {
	planningReflection: BaseSystemPlanning;
	monitoringReflection: BaseSystemMonitoring;
	evaluatingReflection: BaseSystemEvaluating;

	constructor() {
		this.planningReflection = new BaseSystemPlanning();
		this.monitoringReflection = new BaseSystemMonitoring();
		this.evaluatingReflection = new BaseSystemEvaluating();
	}
}

export class BaseSystemPlanning {
	strengths: string;
	strategies: Strategy[];

	constructor() {
		this.strengths = "";
		this.strategies = [];
	}
}

export class BaseSystemMonitoring {
	currentQuestions: string;
	strategies: Strategy[];

	constructor() {
		this.currentQuestions = "";
		this.strategies = [];
	}
}

export class BaseSystemEvaluating {
	summary: string;
	strategies: Strategy[];

	constructor() {
		this.summary = "";
		this.strategies = [];
	}
}

export class Strategy {
	title: StrategyCategories;
	strategy: string;
	rating: number;
	
	// frontend only
	ratingPercentage?: number;
	icon?: string;

	constructor() {
		this.title = null;
		this.strategy = "";
		this.rating = 0;
		this.ratingPercentage = 0;
		this.icon = "";
	}
}