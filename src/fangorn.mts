type Entity = number;
type Component =
  | Record<string, number | string | boolean>
  | string
  | number
  | boolean;

class TaggedArray<T> extends Array<T> {
  readonly tag: symbol;

  constructor(tag: string) {
    super();
    this.tag = Symbol(tag);
  }
}

class Ents {
  private _entityCursor = 0;
  private _components = new Map<symbol, TaggedArray<Component>>();
  private _destroyedEntities: Boolean[] = [];

  makeEntity(): Entity {
    const eidToRecycle = this._destroyedEntities.findIndex((e) => e);
    if (eidToRecycle >= 0) {
      this._destroyedEntities[eidToRecycle] = false;
      this._components.forEach((cList) => {
        delete cList[eidToRecycle];
      });
      return eidToRecycle;
    } else {
      return this._entityCursor++;
    }
  }

  destroyEntity(entity: Entity) {
    this._destroyedEntities[entity] = true;
  }

  makeComponent<T extends Component>(tag: string): TaggedArray<T> {
    const list = new TaggedArray<T>(tag);
    this._components.set(list.tag, list);
    return list;
  }

  bindComponent<T extends Component>(
    entity: Entity,
    componentList: TaggedArray<T>,
    data: T
  ) {
    const cList = this._components.get(componentList.tag);
    if (!cList) {
      throw new Error(
        `Component ${componentList.tag.toString()} does not exist`
      );
    }
    cList[entity] = data;
  }

  unbindComponent<T extends Component>(
    entity: Entity,
    componentList: TaggedArray<T>
  ) {
    const cList = this._components.get(componentList.tag);
    if (!cList) {
      throw new Error(
        `Component ${componentList.tag.toString()} does not exist`
      );
    }
    delete cList[entity];
  }

  with<T extends Component>(components: TaggedArray<T>[]): Entity[] {
    const entities: Entity[] = [];
    const tags = components.map((component) => component.tag);
    // TODO - query caching
    for (let i = 0; i < this._entityCursor; i++) {
      if (
        tags.every((tag) => (this._components.get(tag) as TaggedArray<any>)[i])
      ) {
        if (this._destroyedEntities[i]) {
          continue;
        } else {
          entities.push(i);
        }
      }
    }

    return entities;
  }
}

export { Ents, TaggedArray };
export type { Entity, Component };
