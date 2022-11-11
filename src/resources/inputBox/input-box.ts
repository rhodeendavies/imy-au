import { autoinject, bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { ComponentHelper } from 'utils/componentHelper';

@autoinject
export class InputBox {

	@bindable type: string = InputTypes.text;

	@bindable label: string = "";
	@bindable subLabel: string = "";
	@bindable({ defaultBindingMode: bindingMode.twoWay }) value: string;
	@bindable placeholder: string = "";
	@bindable({ defaultBindingMode: bindingMode.twoWay }) valid: boolean = true;
	@bindable disabled: boolean = false;
	@bindable min: number = 50;
	@bindable max: number = 500;

	@bindable onFocus;
	@bindable onBlur;
	@bindable onChange;
	@bindable onEnter;

	@bindable id: string = "";
	@bindable inputElement: HTMLInputElement = null;

	showPasswordToggle: boolean = false;
	initDone: boolean = false;
	heightTest: string = "";

	constructor() {
		this.id = ComponentHelper.CreateId("inputBox");
	}

	attached() {
		this.initDone = false;
		this.setInputElement();
		this.heightTest = new Array(Math.ceil(this.max / 2)).join("# ");

		setTimeout(() => {
			this.initDone = true;
		});
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
			});
		}
	}

	onBlurTrigger() {
		if (this.onBlur != null) {
			setTimeout(() => {
				this.onBlur();
			});
		}
	}

	onChangeTrigger() {
		if (this.onChange != null) {
			setTimeout(() => {
				this.onChange();
			});
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
					});
				}
			}
		}
	}

	@computedFrom("label")
	get ShowLabel(): boolean {
		return !ComponentHelper.NullOrEmpty(this.label);
	}

	@computedFrom("subLabel")
	get ShowSubLabel(): boolean {
		return !ComponentHelper.NullOrEmpty(this.subLabel);
	}

	@computedFrom("type", "showPasswordToggle")
	get ShowText(): boolean {
		this.setInputElement();
		return this.type == InputTypes.text || this.showPasswordToggle || this.type == InputTypes.large;
	}

	@computedFrom("type", "showPasswordToggle")
	get ShowPassword(): boolean {
		return this.type == InputTypes.password;
	}

	@computedFrom("type")
	get ShowTextarea(): boolean {
		return this.type == InputTypes.textarea;
	}

	@computedFrom("value.length")
	get Valid(): boolean {
		this.valid = this.value != null && this.value.length >= this.min && this.value.length <= this.max;
		return this.valid;
	}

	@computedFrom("type", "showPasswordToggle")
	get ShowHiddenPassword(): boolean {
		this.setInputElement();
		return this.type == InputTypes.password && !this.showPasswordToggle;
	}

	@computedFrom("disabled", "type", "showPasswordToggle")
	get InputClasses(): string {
		let classes = "";
		if (this.disabled) classes += " disable-input";
		if (this.ShowPassword) classes += " password-input";
		if (this.type == InputTypes.large) classes += " large-input";
		if (this.type == InputTypes.textarea) classes += " textarea-input";
		return classes;
	}
}

enum InputTypes {
	text = "text",
	textarea = "textarea",
	large = "large",
	password = "password"
}