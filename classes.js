export class Row {
    rawData = [];
    position = 0;
    readByLength(value, length) {
        if (!value || value === '') throw new Error("EMPTY");
        if (length < 1) throw new Error("BAD_LENGTH");
        if (value.length + this.position < length) throw new Error("TOO_LONG");
        //console.log(`Reading from: ${value}, position: ${this.position}, length: ${length}`);
        this.rawData.push(value.substr(this.position, length));
        this.position += length;
    }
    skip(length){
        this.position += length;
    }
    readByDelimiter(value, delimiter) {
        if (!value || value === '') throw new Error("EMPTY");
        if (!delimiter) throw new Error("BAD_DELIMITER");

        var delIndex = value.indexOf(delimiter, this.position);

        if (delIndex == -1) {
            var partial = value.substr(this.position);
            this.rawData.push(partial);
            //console.log(`Reading to end: ${value}, position: ${this.position}, delIndex: ${delIndex}, partial: "${partial}"`);
            this.position = value.length;
        } else {
            delIndex += delimiter.length;
            var partial = value.substr(this.position, delIndex - this.position - 1);
            //console.log(`Reading from: ${value}, position: ${this.position}, delIndex: ${delIndex}, partial: "${partial}"`);
            this.rawData.push(partial);
            this.position = delIndex;
        }
    }

    readToEnd(value) {
        if (!value || value === '') throw new Error("EMPTY");

        //console.log(`Reading to end: ${value}, position: ${this.position}`);
        this.rawData.push(value.substr(this.position));
        this.position = value.length;
    }
}

export class ABOHeader extends Row {
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

        for (const el of this.elements) {
            this.readByLength(line, el);
        }
    }

    static equals(row) {
        return row.startsWith("UHL1");
    }
}

export class FileHeader extends Row {
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

        this.readByDelimiter(line, ' ');
        this.readByDelimiter(line, ' ');
        this.readByLength(line, 3);
        this.readByLength(line, 3);
        this.skip(1);
        this.readToEnd(line);
    }

    static equals(line) {
        return line.startsWith("1");
    }
}

export class GroupHeader extends Row {

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

        this.readByDelimiter(line, ' ');
        this.readByDelimiter(line, ' ');
        this.readByDelimiter(line, ' ');
        this.readToEnd(line);
    }

    static equals(line) {
        return line.startsWith("2");
    }
}

export class Record extends Row {
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

        this.readByDelimiter(line, ' ');
        this.readByDelimiter(line, ' ');
        this.readByDelimiter(line, ' ');
        this.readByLength(line, 4);
        this.readByLength(line, 4);
    }

    static equals(line) {
        return false;
    }
}