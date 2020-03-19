"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getFilename(name) {
    if (name.endsWith('.proto')) {
        return name;
    }
    else {
        return name + '.proto';
    }
}
exports.getFilename = getFilename;
//# sourceMappingURL=utils.js.map