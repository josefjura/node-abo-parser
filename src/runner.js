import { parseFile } from './index'

parseFile(process.argv[2]).then((data) => {
    console.log(data);
});