export class Parser {
    rawData = [];
    position = 0;
    start(line){
        this.value = line;
        this.position = 0;
    }
    readByLength(length) {
        if (!this.value || this.value === '') throw new Error("EMPTY");
        if (length < 1) throw new Error("BAD_LENGTH");
        if (this.value.length + this.position < length) throw new Error("TOO_LONG");
        //console.log(`Reading from: ${value}, position: ${this.position}, length: ${length}`);
        this.rawData.push(this.value.substr(this.position, length));
        this.position += length;
    }
    skip(length){
        this.position += length;
    }
    readByDelimiter(delimiter) {
        if (!this.value || this.value === '') throw new Error("EMPTY");
        if (!delimiter) throw new Error("BAD_DELIMITER");

        var delIndex = this.value.indexOf(delimiter, this.position);

        if (delIndex == -1) {
            var partial = this.value.substr(this.position);
            this.rawData.push(partial);
            //console.log(`Reading to end: ${value}, position: ${this.position}, delIndex: ${delIndex}, partial: "${partial}"`);
            this.position = this.value.length;
        } else {
            delIndex += delimiter.length;
            var partial = this.value.substr(this.position, delIndex - this.position - 1);
            //console.log(`Reading from: ${value}, position: ${this.position}, delIndex: ${delIndex}, partial: "${partial}"`);
            this.rawData.push(partial);
            this.position = delIndex;
        }
    }

    readToEnd() {
        if (!this.value || this.value === '') throw new Error("EMPTY");

        //console.log(`Reading to end: ${value}, position: ${this.position}`);
        this.rawData.push(this.value.substr(this.position));
        this.position = this.value.length;
    }
}

export class ABOHeaderParser extends Parser {
    get datum(){
        return this.rawData[1];
    }
    get nazev_prikazce(){
        return this.rawData[2];
    }
    get cislo_klienta(){
        return this.rawData[3];
    } 

    length = 58
    elements = [4, 6, 20, 10, 3, 3, 6, 6];
    parse(line) {

        if (!line) throw Error("EMPTY HEADER");
        if (line.length != this.length) throw Error("BAD HEADER LENGTH");
        this.start(line);
        for (const el of this.elements) {
            this.readByLength(el);
        }
    }

    static equals(row) {
        return row.startsWith("UHL1");
    }
}

export class FileHeaderParser extends Parser {
    get druh(){
        return this.rawData[1];
    }
    get poradove_cislo(){
        return this.rawData[2];
    }
    get pobocka_banky(){
        return this.rawData[3];
    }    
    get kod_banky_prikazce(){
        return this.rawData[4];
    }

    parse(line){
        if (!line) throw Error("EMPTY HEADER");

        this.start(line)
        this.readByDelimiter(' ');
        this.readByDelimiter(' ');
        this.readByLength(3);
        this.readByLength(3);
        this.skip(1);
        this.readToEnd();
    }

    static equals(line) {
        return line.startsWith("1");
    }
}

export class GroupHeaderParser extends Parser {

    get prikazce(){
        return this.rawData[1];
    }
    get suma(){
        return this.rawData[2];
    }
    get splatnost(){
        return this.rawData[3];
    }
    
    parse(line){
        if (!line) throw Error("EMPTY HEADER");

        this.start(line);
        this.readByDelimiter(' ');
        this.readByDelimiter(' ');
        this.readByDelimiter(' ');
        this.readToEnd();
    }

    static equals(line) {
        return line.startsWith("2");
    }
}

export class RecordParser extends Parser {
    // protistrana castka vsym bank ksym
    get protistrana(){
        return this.rawData[0];
    }
    get castka(){
        return this.rawData[1];
    }
    get vsym(){
        return this.rawData[2];
    }
    get kod_banky(){
        return this.rawData[3];
    }
    get ksym(){
        return this.rawData[4];
    }

    parse(line){
        if (!line) throw Error("EMPTY HEADER");

        this.start(line)
        this.readByDelimiter(' ');
        this.readByDelimiter(' ');
        this.readByDelimiter(' ');
        this.readByLength(4);
        this.readByLength(4);
    }

    static equals(line) {
        return false;
    }
}