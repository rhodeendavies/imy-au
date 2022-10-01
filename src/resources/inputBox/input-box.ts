import { autoinject, bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { ComponentHelper } from 'utils/componentHelper';

@autoinject
export class InputBox {

	@bindable type: string = InputTypes.text;
	@bindable label: string = "";
	@bindable subLabel: string = "";
	@bindable({ defaultBindingMode: bindingMode.twoWay }) value: string;
	@bindable placeholder: string = "";
	@bindable valid: boolean = true;
	@bindable required: boolean = true;
	@bindable disabled: boolean = false;
	@bindable onFocus;
	@bindable onBlur;
	@bindable onChange;
	@bindable onEnter;
	@bindable id: string = "";
	@bindable inputElement: HTMLInputElement = null;

	showPasswordToggle: boolean = false;
	initDone: boolean = false;

	constructor() {
		this.id = ComponentHelper.CreateId("inputBox");
	}

	attached() {
		this.init();
	}

	init() {
		this.initDone = false;
		this.setInputElement();

		setTimeout(() => {
			this.initDone = true;
		}, 10);
	}

	setInputElement() {
		this.inputElement = document.getElementById(this.id) as HTMLInputElement;
		if (this.inputElement != null) {
			this.inputElement?.addEventListener('keypress', this.onEnterTrigger());
		}
	}

	togglePassword() {
		this.showPasswordToggle = !this.showPasswordToggle;
	}

	onFocusTrigger() {
		if (this.onFocus != null) {
			setTimeout(() => {
				this.onFocus();
			}, 10);
		}
	}

	onBlurTrigger() {
		if (this.onBlur != null) {
			setTimeout(() => {
				this.onBlur();
			}, 10);
		}
	}

	onChangeTrigger() {
		if (this.onChange != null) {
			setTimeout(() => {
				this.onChange();
			}, 10);
		}
	}

	onEnterTrigger() {
		return (e: KeyboardEvent) => {
			e.stopImmediatePropagation();
			e.stopPropagation();
			if (e.key == "Enter") {
				this.onChangeTrigger();
				if (this.onEnter != null) {
					setTimeout(() => {
						this.onEnter();
					}, 10);
				}
			}
		}
	}

	@computedFrom("value")
	get ErrorText(): string {
		if (this.value.isNullOrEmpty() && this.required) {
			return "Required";
		}
		return "";
	}

	@computedFrom("label")
	get ShowLabel(): boolean {
		return !this.label.isNullOrEmpty();
	}

	@computedFrom("subLabel")
	get ShowSubLabel(): boolean {
		return !this.subLabel.isNullOrEmpty();
	}

	@computedFrom("type", "showPasswordToggle")
	get ShowText(): boolean {
		this.setInputElement();
		return this.type == InputTypes.text || this.showPasswordToggle;
	}

	@computedFrom("type", "showPasswordToggle")
	get ShowPassword(): boolean {
		return this.type == InputTypes.password;
	}

	@computedFrom("type", "showPasswordToggle")
	get ShowHiddenPassword(): boolean {
		this.setInputElement();
		return this.type == InputTypes.password && !this.showPasswordToggle;
	}

	@computedFrom("disabled")
	get InputClasses(): string {
		let classes = "";
		if (this.disabled) classes += " disable-input";
		if (!this.valid) classes += " invalid-input";
		return classes;
	}
}

enum InputTypes {
	text = "text",
	password = "password"
}