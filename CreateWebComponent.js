/**
 * Class creation the global web component
 * @author Judicaël DUBRAY
 */
class CreateWebComponent {

    /**
     * Default constructor
     */
    constructor() {
        //Module to write file
        this.fs = require('fs');
        //css coming from css file
        this.cssTemplate;
        //html coming from the html file
        this.htmlTemplate;
        //the get and set fro variable
        this.getterSetter;
        //logic js for the component comming from the logic.js file
        this.attributeChanged;
        //variable to observe
        this.observeVariable;
        //Variable to add to the constructor of the  webcomonent
        this.variableConstructor;
        //the custom element name for querry selector
        this.querrySelector;
        //the output of the final file for the web component
        this.output;
        //the class name of the webComponent
        this.className;
    }

    /**
     * Builder component to create tthe final class of the web Component
     * @param {*} cssTemplate 
     * @param {*} htmlTemplate 
     * @param {*} observeVariable 
     * @param {*} logicTemplateAdapted 
     * @param {*} objectConstructor 
     * @param {*} querrySelector 
     * @param {*} output 
     */
    buildComponent(cssTemplate, htmlTemplate, observeVariable, logicTemplateAdapted, objectConstructor, querrySelector, output) {
        //Instantiation of the css template
        this.cssTemplate = cssTemplate;
        //Instantiation of the html template
        this.htmlTemplate = htmlTemplate;
        //Creation of the getter and setter from the observable variable
        this.getterSetter = CreateWebComponent.buildGetSet(observeVariable);
        //Build of the Observable variable tfor the web component
        this.observeVariable = CreateWebComponent.buildObservableVariable(observeVariable);
        //Logic of the web component
        this.attributeChanged = logicTemplateAdapted;
        //Creation of the constructor variable of the web component
        this.variableConstructor = CreateWebComponent.constructorBuilder(observeVariable, objectConstructor);
        // Instantiation of the custom element name for querry selector
        this.querrySelector = querrySelector;
        // Instantiation of the output of the final file for the web component
        this.output = output;
        // Instantiation of the name of the class  of the web component
        this.className = CreateWebComponent.className(querrySelector);

        //Template of the web component
        var component = `
                class  ${this.className} extends HTMLElement {
                        constructor(){
                                super();

                                this.shadow = this.createShadowRoot();
                                ${ this.variableConstructor}
                        };
                        ${this.getterSetter}

                        static get observedAttributes(){
                            return[${this.observeVariable}];
                        };
                        attributeChangedCallback(name, oldVal, newVal){
                        ${this.attributeChanged}
                        };
                        connectedCallback(){
                            var template =\`
                            <style>
                                ${this.cssTemplate}
                            </style>

                            ${this.htmlTemplate}
                        \`;
                                this.shadow.innerHTML =template;

                        }

                }
        
                window.customElements.define( '${this.querrySelector}', ${this.className});
            
            `;

        return component;
    }
    /**
     * Method to build the getter and setter from the observable variable
     * @param {*} observeVariable 
     */
    static buildGetSet(observeVariable) {

        let getsetbuild = ``;
        var res = [];
        observeVariable.forEach(function (element) {

            var elt = CreateWebComponent.getterSetterFunction(element);
            res.push(elt)


        }, this);

        return res.join("\r\n");
    }

    /**
     * Genetator of getter and setter 
     * @param {*} element 
     */
    static getterSetterFunction(element) {

        let getset = ` get ` + element + `(){
                        return this._` + element + `;
                        };
    
                        set ` + element + `(val){
                            this.setAttribute('` + element + `', val);
                        }; `;

        return getset;
    }

    /**
     * Méthode to build the observedAttributes of the web component
     * @param {Array} observeVariable 
     */
    static buildObservableVariable(observeVariable) {

        var res = [];
        observeVariable.forEach(function (element) {

            var elt = CreateWebComponent.separateElementObservable(element);
            res.push(elt)


        }, this);

        return res.join(",");

    }

    /**
     * Creating each observable element for the observedAttributes method
     * @param {*} element 
     */
    static separateElementObservable(element) {
        let observed = `'` + element + `'`;

        return observed;
    }

    /**
     * Method to create the constructor of the webcomopent class
     * @param {*} observeVariable 
     * @param {*} objectConstructor 
     */
    static constructorBuilder(observeVariable, objectConstructor) {
        var res = [];
        observeVariable.forEach(function (element) {

            var elt = CreateWebComponent.variableConstructor(element, objectConstructor);
            res.push(elt)


        }, this);

        return res.join("\r\n");
    }

    /**
     * Méthode to build the variable in the constructor
     * @param {*} element 
     * @param {*} objectConstructor 
     */
    static variableConstructor(element, objectConstructor) {

        var res;
        if (objectConstructor[element] != null) {
            if (typeof objectConstructor[element] === 'string' || objectConstructor[element] instanceof String) {
                res = 'this._' + element + ' = "' + objectConstructor[element] + '";';
            } else {
                res = 'this._' + element + ' =' + objectConstructor[element] + ';';
            }

        } else if (objectConstructor[element] == null) {
            res = 'this._' + element + ';';
        }
        return res;
    }

    /**
     * Method to create the name of that class
     * @param {*} selectorName 
     */
    static className(selectorName) {
        var fields = selectorName.split('-');
        var first = fields[0].charAt(0).toUpperCase()+fields[0].substr(1).toLowerCase();
        var last = fields[1].charAt(0).toUpperCase()+fields[1].substr(1).toLowerCase();
        return first + last;
    }

    /**
     * 
     * @param {*} component 
     */
    writteComponent(component) {
        this.fs.mkdirSync('component');
        this.fs.writeFileSync('./component/' + this.output + '.js', component);
    }
}