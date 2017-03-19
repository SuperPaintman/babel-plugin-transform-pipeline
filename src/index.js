'use strict';
/** Requires */
import syntax from 'babel-plugin-syntax-pipeline';


/** Visitor */
export default function ({ types: t }) {
  return {
    inherits: syntax,
    visitor: {
      BinaryExpression(path, state) {
        if (!path.isBinaryExpression({ operator: '|>' })) {
          return;
        }

        path.replaceWith(
          t.callExpression(path.node.right, [path.node.left])
        );
      }
    }
  };
}
