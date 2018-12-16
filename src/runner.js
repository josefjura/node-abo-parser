import { parseFile } from './index'

parseFile("./examples/example1.KPC").then((data) => {
    console.log(data);
});