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
	@bindable min: number = null;
	@bindable max: number = null;
	@bindable showInfo: boolean = false;
	@bindable error: string = "";
	@bindable validate: boolean = true;

	@bindable onFocus;
	@bindable onBlur;
	@bindable onChange;
	@bindable onEnter;

	@bindable id: string = "";
	@bindable inputElement: HTMLInputElement = null;

	showPasswordToggle: boolean = false;
	initDone: boolean = false;
	heightTest: string = "";
	focussed: boolean = false;

	constructor() {
		this.id = ComponentHelper.CreateId("inputBox");
	}

	attached() {
		this.initDone = false;
		this.setInputElement();
		this.heightTest = new Array(Math.ceil(this.max / 2)).join("# ");

		if (this.ShowTextarea) {
			// check the length between 50 and 250
			if (this.min == null) {
				this.min = 50;
			}
			if (this.max == null) {
				this.max = 250;
			}
		}

		if (!ComponentHelper.NullOrEmpty(this.value)) {
			this.validateValue();
		}

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

	validateValue() {
		if (this.validate) {
			if (this.value == null) return false;

			if (this.ShowLarge) {
				// test if its a number between 0 and 5
				this.valid = /^\d+$/.test(this.value) && +this.value <= 5 && +this.value >= 0;
			} else if (this.ShowTextarea) {
				this.valid = this.value != null && this.value.length >= this.min && this.value.length <= this.max;
			} else if (this.ShowSmall || this.ShowWord) {
				this.valid = ComponentHelper.PromptInputValid(this.value, this.max, this.min);

				if (!this.valid) {
					if (this.value.length > this.max) {
						this.error = `Maximum ${this.max} characters`;
					} else if (this.value.length < this.min) {
						this.error = `Minimum ${this.min} characters`;
					}
				}

				if (this.ShowWord) {
					this.value = this.value.trim();
					const isSingleWord = ComponentHelper.ValueIsSingleWord(this.value);
					if (!isSingleWord) {
						this.error = "Must be a single word";
						this.valid = false;
					}
				}
			} else {
				// no validation
				this.valid = true;
			}
	
			// check for funky characters
			this.valid = this.valid && ComponentHelper.InputValid(this.value);
		}
	}

	onFocusTrigger() {
		this.focussed = true;
		if (this.onFocus != null) {
			setTimeout(() => {
				this.onFocus();
			});
		}
	}

	onBlurTrigger() {
		this.focussed = false;
		if (this.onBlur != null) {
			setTimeout(() => {
				this.onBlur();
			});
		}
	}

	onChangeTrigger() {
		this.validateValue();

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
		return this.type == InputTypes.text || this.showPasswordToggle || this.ShowLarge || this.ShowSmall || this.ShowWord;
	}

	@computedFrom("type")
	get ShowLarge(): boolean {
		this.setInputElement();
		return this.type == InputTypes.large;
	}

	@computedFrom("type", "showPasswordToggle")
	get ShowPassword(): boolean {
		return this.type == InputTypes.password;
	}

	@computedFrom("type")
	get ShowTextarea(): boolean {
		return this.type == InputTypes.textarea;
	}

	@computedFrom("type")
	get ShowSmall(): boolean {
		return this.type == InputTypes.small;
	}

	@computedFrom("type")
	get ShowWord(): boolean {
		return this.type == InputTypes.word;
	}

	@computedFrom("value.length")
	get LargeTextValid(): boolean {
		if (this.value == null) return false;

		// check for funky characters
		return this.value != null && this.value.length >= this.min && this.value.length <= this.max
			&& ComponentHelper.InputValid(this.value);
	}

	@computedFrom("type", "showPasswordToggle")
	get ShowHiddenPassword(): boolean {
		this.setInputElement();
		return this.type == InputTypes.password && !this.showPasswordToggle;
	}

	@computedFrom("type", "min", "max")
	get ShowMinMax(): boolean {
		return (this.min != null || this.max != null) && !this.ShowTextarea;
	}

	@computedFrom("disabled", "type", "showPasswordToggle", "valid")
	get InputClasses(): string {
		let classes = "";
		if (this.valid != null && !this.valid) classes += " input-invalid";
		if (this.disabled) classes += " disable-input";
		if (this.ShowPassword) classes += " password-input";
		if (this.ShowLarge) classes += " large-input";
		if (this.type == InputTypes.textarea) classes += " textarea-input";
		return classes;
	}

	@computedFrom("value", "max", "min")
	get Valid(): boolean {
		if (this.validate) {
			if (this.value == null) return false;

			if (this.ShowLarge) {
				// test if its a number between 0 and 5
				this.valid = /^\d+$/.test(this.value) && +this.value <= 5 && +this.value >= 0;
			} else if (this.ShowTextarea) {
				this.valid = this.value != null && this.value.length >= this.min && this.value.length <= this.max;
			} else if (this.ShowSmall || this.ShowWord) {
				this.valid = ComponentHelper.PromptInputValid(this.value, this.max, this.min);
				if (this.ShowWord) {
					this.value = this.value.trim();
					this.valid = this.valid && ComponentHelper.ValueIsSingleWord(this.value);
				}
			} else {
				// no validation
				this.valid = true;
			}
	
			// check for funky characters
			this.valid = this.valid && ComponentHelper.InputValid(this.value);
		}

		return this.valid;
	}
}

enum InputTypes {
	text = "text",
	textarea = "textarea",
	large = "large",
	password = "password",
	small = "small",
	word= "word"
}