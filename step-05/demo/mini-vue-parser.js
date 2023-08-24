const compilerSfc = require("@vue/compiler-sfc");
const path = require('path');

function parse(vueFileString,fileName) {
    const sfc = compilerSfc.parse(
        vueFileString
    );
    const sfcTemplate = compilerSfc.compileTemplate({
        id: 'sfc',
        filename: fileName + '.template.vue',
        source: sfc.descriptor.template.content
    })

    const sfcScript = compilerSfc.compileScript(sfc.descriptor, {
        filename: 'sfc.script.vue'
    })

    let result = '';
    result += sfcTemplate.code.replace("export", "") + '\n';
    result += sfcScript.content.replace("export default ", "const __script = ") + '\n';
    result += `__script.render=render;\n`
    result += `export default __script;`
    result = result.replace(/from ['"]vue['"]/g, "from './node_modules/vue/dist/vue.esm-browser.js'");

    return result;
}

module.exports = {
    parse
}