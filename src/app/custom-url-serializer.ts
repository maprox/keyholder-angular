import { UrlTree, DefaultUrlSerializer } from '@angular/router';

export class CustomUrlSerializer extends DefaultUrlSerializer {
    serialize(tree: UrlTree): any {
        const path = super.serialize(tree);
        // decode slashes in the path
        return path.replace(/%2F/g, '/');
    }
}
