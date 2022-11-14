const crypto = require('crypto');
const fs = require("fs")
const rl = require("readline-sync")
const Color = require("sync-color")
Color.init()
var algo = "aes-256-gcm"
var key = "1".repeat(32) // Key, feel free to change this, length must be 32

process.title = "Jupyter Encoder - !\"Dialz_†#0069"
if (!fs.existsSync("./output")) fs.mkdirSync("./output")
class Jupyter {
    constructor(key) {
        this.key = key
    }
    encrypt(str) {
        var start = new crypto.randomBytes(12);
        var cipher = crypto.createCipheriv(algo, this.key, start);

        var enc1 = cipher.update(str, 'utf8');
        var enc2 = cipher.final();
        return Buffer.concat([enc1, enc2, start, cipher.getAuthTag()]).toString("base64");
    }
    decrypt(middle) {
        middle = Buffer.from(middle, "base64");
        var len = middle.length
        const start = middle.slice(len - 28, len - 16);

        const end = middle.slice(len - 16);

        middle = middle.slice(0, len - 28);

        const decipher = crypto.createDecipheriv(algo, this.key, start);

        decipher.setAuthTag(end);

        let str = decipher.update(middle, null, 'utf8') + decipher.final('utf8');

        return str;
    }
}

const jupyter = new Jupyter(key);


function main() {
    if (key.length !== 32) throw new Error("Key's Length Must Be 32")
    console.clear()
    console.log(colorize(`
                           |                            
Jupyter File Encoder       |     Key To Decrypt: ${key}                       
                                                        
                           $                            
                          :$'                           
                      .-* $$  *-.                       
                    '    :$$ '    '                     
                         $$$                            
                '       :$$$  '       '                 
               '       .$$$$   .       '                
              :     . ''T$$$  .dbs._    ;               
              .  '       'T$.d$$$$$$$bs._               
---------- -=+sssssssssssss$^^^^^^^^^^^^^^*=- ----------
              '"*T$$$$$$$P'$b.       .  '               
              :    '"*TP'  $$$b.. '     ;               
               .       '   $$$$'       .                
                .       .  $$$;       .                 
                           $$$                          
                    .    . $$;    .                     
                      '-.  $$ .-'                       
                          .$;                           
                           $                            
                                                                          
[1]: Encode A File         |            Creator: 
[2]: Decode A File         |          !"Dialz_†#0069`))
    var res = rl.question(colorize("?: "))
    switch (res) {
        default:
            console.log(colorize("Please, Choose 1 or 2"))
            rl.question()
            main()
            break
        case "1":
            var file = rl.question(colorize("Drag Your File Here: "))
            var fileName = file.split(/(\/|\\)/g).pop()
            var nn = fs.readFileSync(file).toString()
            var encrypt = jupyter.encrypt(nn);
            fs.writeFileSync(`./output/encrypted-${fileName}`, encrypt)
            rl.question(colorize(`${fileName} Successfully Encoded !`))
            main()
            break
        case "2":
            var file = rl.question(colorize("Drag Your File Here: "))
            var fileName = file.split(/(\/|\\)/g).pop()
            var nn = fs.readFileSync(file).toString()
            var decrypt = jupyter.decrypt(nn);
            fs.writeFileSync(`./output/decrypted-${fileName}`, decrypt)
            rl.question(colorize(`${fileName} Successfully Decoded !`))
            main()
            break
    }
}

main()

function colorize(str) {
    return Color.InitGradient("magenta", "blue")(str)
}
