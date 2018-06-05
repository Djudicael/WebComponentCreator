/**
 * Class to read CSS HTML and JS
 * @author Judicaël DUBRAY
 */
class ReaderElement {

    /**
     * Constructor
     */
    constructor() {
        this.fs = require('fs');
        this.cssContent;
        this.htmlContent;
    }

    /**
     * Method to read the css file
     * @param {*} path 
     */
    readCss(path) {
        var read_string = this.fs.readFileSync(path, 'utf8');
        return read_string;
    }

    /**
     * Méthod to read the html file
     * @param {*} path 
     */
    readHtlml(path) {
        var read_string = this.fs.readFileSync(path, 'utf8');
        return read_string;
    }

    /**
     * Method to read the js file
     * @param {*} path 
     */
    readJsLogic(path) {
        var read_string = this.fs.readFileSync(path, 'utf8');
        return read_string;
    }

}