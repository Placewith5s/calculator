document.addEventListener("DOMContentLoaded", () => {
    class Calculator {
        // static {
        //     console.info("Calculator running...");
        // }

        #main: HTMLElement | null;
        #display: HTMLSpanElement | null;
        #clear_btn: HTMLButtonElement | null;
        #clear_last_input_btn: HTMLButtonElement | null;
        #equal_sign_btn: HTMLButtonElement | null;
        #target_buttons: NodeListOf<HTMLButtonElement>;

        constructor () {
            this.#main = document.querySelector('main');

            if (!this.#main) {
                throw new Error("No main element!");
            }

            this.#display = this.#main.querySelector('#display');
            this.#clear_btn = this.#main.querySelector('#clear-btn');
            this.#clear_last_input_btn = this.#main.querySelector('#clear-last-input-btn');
            this.#equal_sign_btn = this.#main.querySelector('#equal-sign-btn');
            this.#target_buttons = this.#main.querySelectorAll('.target-btn');

            if (!this.#target_buttons.length) {
                throw new Error("No target buttons!");
            }

            this.#check_inv_display();
            this.#append_to_display();
            this.#clear_display();
            this.#clear_last_input();
            this.#calculate();
        }


        #check_inv_display(): void | never {
            if (!this.#display) {
                throw new Error("No display element!");
            }
        }

        #append_to_display(): void {
            let debounce_target_btn: boolean = false;

            this.#target_buttons.forEach(btn => {
                // console.log("target btn found");

                btn.addEventListener("click", () => {
                    if (debounce_target_btn) return
                    debounce_target_btn = true;

                    if (this.#display.textContent.trim() === "0" && ["+", "*", "/", ".", "="].includes(btn.textContent.trim())) {
                        debounce_target_btn = false;
                        return;
                    }
                    if (["+", "-", "*", "/", ".", "="].includes(this.#display.textContent.slice(-1)) && ["+", "-", "*", "/", ".", "="].includes(btn.textContent.trim())) {
                        debounce_target_btn = false;
                        return;
                    }

                    if (this.#display.textContent === "0") {
                        this.#display.textContent = "";
                        this.#display.textContent += btn.textContent;
                        debounce_target_btn = false;
                        return;
                    }

                    this.#display.textContent += btn.textContent;

                    setTimeout(() => {
                        debounce_target_btn = false;
                    }, 100);
                }, { passive: true });;
            })
        }

        #clear_display(): void {
            let debounce_clear_btn: boolean = false;

            this.#clear_btn?.addEventListener("click", () => {
                if (debounce_clear_btn) return
                debounce_clear_btn = true;

                this.#display.textContent = "0";
                this.#clear_btn.textContent = "AC";

                setTimeout(() => {
                    debounce_clear_btn = false;
                }, 100);
            }, { passive: true });
        }

        #clear_last_input(): void {
            let debounce_last_input_btn: boolean = false;

            this.#clear_last_input_btn?.addEventListener("click", () => {
                if (debounce_last_input_btn) return
                debounce_last_input_btn = true;

                if (this.#display.textContent !== "0") {
                    this.#display.textContent = this.#display.textContent.slice(0, -1);
                } else {
                    this.#display.textContent = "0";
                }

                setTimeout(() => {
                    debounce_last_input_btn = false;
                }, 100);
            }, {passive: true });
        }

        #calculate(): void {
            let debounce_equal_sign_btn: boolean = false;

            this.#equal_sign_btn?.addEventListener("click", () => {
                if (debounce_equal_sign_btn) return
                debounce_equal_sign_btn = true;

                if (this.#display.textContent.trim().endsWith("=")) {
                    this.#display.textContent = this.#display.textContent.slice(0, -1);
                }

                try {
                    if (this.#display.textContent.trim() !== "0") {
                        this.#display.textContent = math.evaluate(this.#display.textContent);
                    }
                } catch (err) {
                    throw new Error(`Couldn't get math package? ${err}`);
                } finally {
                    setTimeout(() => {
                        debounce_equal_sign_btn = false;
                    }, 100);
                }
            }, { passive: true });
        }
    }

    new Calculator();

    const handle_clear_btn_txt = async() => {
        const main: HTMLElement | null = document.querySelector('main');

        if (!main) {
            throw new Error("No main element!");
        }

        const display: HTMLSpanElement | null = main.querySelector('#display');
        const clear_btn: HTMLButtonElement | null = main.querySelector('#clear-btn');

        if (!display || !clear_btn) {
            throw new Error("No display or clear button!");
        }

        if (display.textContent.trim() !== "0") {
            clear_btn.textContent = "C";
        }
    }

    setInterval(() => {
        handle_clear_btn_txt();
    }, 100);
});