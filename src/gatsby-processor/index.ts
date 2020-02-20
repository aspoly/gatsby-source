import createNodeHelpers from 'gatsby-node-helpers';
import { ContentMesh, ContentNode } from '../content-mesh';
import { GatsbyType } from './gatsby-type';

export type GatsbyProcessorMutateFunc = (node: ContentNode) => ContentNode | undefined;

export interface GatsbyProcessorConfig {
  typePrefix?: string;
  includeJunctions?: boolean;
  downloadFiles?: boolean;
  mutateContent?: GatsbyProcessorMutateFunc;
}

export class GatsbyProcessor {
  private _typePrefix = 'Directus';
  private _includeJunctions = false;
  private _downloadFiles = true;
  private _mutateContent: GatsbyProcessorMutateFunc = node => node;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public gatsby: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public createNodeFactory: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public generateNodeId: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(config: GatsbyProcessorConfig, gatsby: any) {
    if (typeof config.typePrefix === 'string') {
      this._typePrefix = config.typePrefix;
    }

    if (typeof config.includeJunctions === 'boolean') {
      this._includeJunctions = config.includeJunctions;
    }

    if (typeof config.downloadFiles === 'boolean') {
      this._downloadFiles = config.downloadFiles;
    }

    if (typeof config.mutateContent === 'function') {
      this._mutateContent = config.mutateContent;
    }

    const { createNodeFactory, generateNodeId } = createNodeHelpers({
      typePrefix: this._typePrefix,
    });

    this.createNodeFactory = createNodeFactory;
    this.generateNodeId = generateNodeId;
    this.gatsby = gatsby;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async processMesh(mesh: ContentMesh): Promise<any[]> {
    const nodes = await Promise.all(
      mesh
        .getCollections()
        .filter(({ isJunction }) => !isJunction || this._includeJunctions)
        .map(collection => new GatsbyType(collection, this).buildNodes()),
    );

    return Promise.all(
      nodes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .reduce((flattened, nodes) => [...flattened, ...nodes], [] as any[])
        .map(node => this.gatsby.actions.createNode(node)),
    );
  }

  public mutateContent(node: ContentNode): ContentNode | undefined {
    return this._mutateContent(node);
  }

  public get downloadFiles(): boolean {
    return this._downloadFiles;
  }
}
