import { UrlTree, DefaultUrlSerializer } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomUrlSerializer extends DefaultUrlSerializer {
    serialize(tree: UrlTree): any {
        const path = super.serialize(tree);
        // decode slashes in the path
        return path.replace(/%2F/g, '/');
    }
}
