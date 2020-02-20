"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class JunctionContentRelation extends __1.ContentRelation {
    constructor(config) {
        super(config);
        this._junctionTable = config.junctionTable;
        this._srcJunctionField = config.srcJunctionField;
        this._destJunctionField = config.destJunctionField;
        config.junctionTable.flagJunction();
    }
    _resolveNodeRelation(node, tableType) {
        const targetField = tableType === 'src' ? this._srcField : this._destField;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const existing = node.contents[targetField] || [];
        // Explicit cast here because we're filtering out any
        // 'void' values.
        return existing
            .map(junctionRecord => this._resolveJunctionNodes(junctionRecord))
            .map(({ src, dest }) => (tableType === 'src' ? dest : src))
            .filter(node => !!node);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _resolveJunctionNodes(junctionRecord) {
        return {
            src: this._srcTable.getByPrimaryKey(junctionRecord[this._destJunctionField]),
            dest: this._destTable.getByPrimaryKey(junctionRecord[this._srcJunctionField]),
        };
    }
}
exports.JunctionContentRelation = JunctionContentRelation;
