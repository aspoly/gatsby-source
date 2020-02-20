"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const content_node_1 = require("../content-node");
class ContentCollection {
    constructor(config) {
        this._nodes = {};
        this._isJunction = false;
        this._collection = config.collection;
        this._primaryKeyFieldName = this._resolvePrimaryKeyFieldName(config.collection);
        this._nodes = this._buildNodes(config);
    }
    _buildNodes({ records = [] }) {
        return records.reduce((bag, record) => {
            const node = new content_node_1.ContentNode({
                record,
                collection: this,
                primaryKeyFieldName: this._primaryKeyFieldName,
            });
            bag[node.primaryKey] = node;
            return bag;
        }, {});
    }
    _resolvePrimaryKeyFieldName(collection) {
        // eslint-disable-next-line @typescript-eslint/camelcase
        const [pkField] = Object.values(collection.fields).filter(({ primary_key }) => primary_key);
        if (!pkField) {
            throw new Error(`Unable to resolve PK field for collection ${collection.collection}`);
        }
        return pkField.field;
    }
    flagJunction(isJunction = true) {
        this._isJunction = isJunction;
    }
    get isJunction() {
        return this._isJunction;
    }
    get isInternal() {
        return !!this._collection.collection.match(/^directus/i);
    }
    get isFileCollection() {
        return this.name === 'directus_files';
    }
    acceptsRelations() {
        return !this.isInternal || !this.isFileCollection;
    }
    get name() {
        return this._collection.collection;
    }
    get fields() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Object.values(this._collection.fields);
    }
    getNodes() {
        return Object.values(this._nodes);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getByPrimaryKey(pk) {
        return this._nodes[pk];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getByRecord(record) {
        const pk = (record || {})[this._primaryKeyFieldName];
        return this.getByPrimaryKey(pk);
    }
}
exports.ContentCollection = ContentCollection;
