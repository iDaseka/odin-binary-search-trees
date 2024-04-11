class Node {
    constructor(data, left = null, right = null) {
        this.data = data;
        this.left = left;
        this.right = right;
    }
}

class Tree{
    constructor(array) {
        this.root = this.buildTree(array);
    };
    buildTree(array){
        if (array.length === 0){
            return null;
        }

        const sortedArray = Array.from(new Set(array)).sort((a, b) => a - b);
        
        const mid = Math.floor(sortedArray.length / 2);
        const node = new Node(sortedArray[mid]);
        
        node.left = this.buildTree(sortedArray.slice(0, mid));
        node.right = this.buildTree(sortedArray.slice(mid + 1));
        
        return node;
    };//
    insert(value){
        const newNode = new Node(value);

        if (this.root === null){
            this.root = newNode;
        }
        else{
            let current = this.root;
            while (true){
                if (value < current.data){
                    if (current.left === null){
                        current.left = newNode;
                        break;
                    }
                    current = current.left;
                }
                else if (value > current.data){
                    if (current.right === null){
                        current.right = newNode;
                        break;
                    }
                    current = current.right;
                }
            }
        }
    };//
    deleteItem(value){
        //Empty tree
        if (this.root === null){
            return null;
        }

        let parent = null;
        let current = this.root;
        let isLeft = false;
        
        while (current && current.data !== value){
            parent = current;
            if (value < current.data){
                current = current.left;
                isLeft = true;
            }
            else{
                current = current.right;
                isLeft = false;
            }
        }

        if (current === null){
            return false;
        }

        //1: Node without children
        if (!current.left && !current.right){
            if (current === this.root){
                this.root = null;
            }
            else if (isLeft){
                parent.left = null;
            }
            else{
                parent.right = null;
            }
        }
        //2: Node with 1 child
        else if (!current.left){
            if (current === this.root){
                this.root = current.right;
            }
            else if (isLeft){
                parent.left = current.left;
            }
            else{
                parent.right = current.right;
            }
        }
        else if (!current.right){
            if (current === this.root){
                this.root = current.left;
            }
            else if (isLeft){
                parent.left = current.left;
            }
            else{
                parent.right = current.right;
            }
        }
        //3: Node with 2 children
        else{
            let succesorParent = current;
            let succesor = current.right;
            while (succesor.left){
                succesorParent = succesor;
                succesor = succesor.left;
            }

            if (succesorParent !== current.right){
                succesorParent.left = succesor.right;
                succesor.right = current.right;
            }

            if (current === this.root){
                this.root = succesor;
            }
            else if (isLeft){
                parent.left = succesor;
            }
            else{
                parent.right = succesor;
            }
            succesor.left = current.left;
        }
        return true;
    };//
    find(value){
        if (this.root === null){
            return null;
        }

        let current = this.root;
        while (current){
            if (value !== current.data){
                if (value < current.data){
                    current = current.left;
                }
                else{
                    current = current.right;
                }
            }
            else if (value === current.data){
                return current;
            }
        }
        return null;
    };//
    levelOrder(callback){
        const result = [];
        const queue = [];

        if (this.root){
            queue.push(this.root);
        }

        while (queue.length > 0){
            const node = queue.shift();
            result.push(node.data);

            if (node.left){
                queue.push(node.left);
            }
            if (node.right){
                queue.push(node.right);
            }
            if (callback){
                callback(node);
            }
        }
        return result;
    };//
    inOrder(callback){
        const result = [];

        function traverse(node){
            if (node.left){
                traverse(node.left);
            }
            result.push(node.data);
            if (callback){
                callback(node);
            }
            if (node.right){
                traverse(node.right);
            }
        }
        
        traverse(this.root);

        return callback ? undefined : result;
    };//
    preOrder(callback){
        const result = [];

        function traverse(node){
            result.push(node.data);
            if (callback){
                callback(node);
            }
            if (node.left){
                traverse(node.left);
            }
            if (node.right){
                traverse(node.right);
            }
        }
        
        traverse(this.root);

        return callback ? undefined : result;
    };//
    postOrder(callback){
        const result = [];

        function traverse(node){
            if (node.left){
                traverse(node.left);
            }
            if (node.right){
                traverse(node.right);
            }
            result.push(node.data);
            if (callback){
                callback(node);
            }
        }
        
        traverse(this.root);

        return callback ? undefined : result;
    };//
    height(node){
        if (!node){
            return -1;
        }

        const leftHeight = this.height(node.left);
        const rightHeight = this.height(node.right);

        return Math.max(leftHeight, rightHeight) + 1;
    };
    depth(node){
        if (!node){
            return -1;
        }

        let depth = 0;
        while (node.parent){
            node = node.parent;
            depth++;
        }

        return depth
    };
    isBalanced(){
        const getHeight = (node) => {
            if (!node){
                return 0;
            }

            const leftHeight = getHeight(node.left);
            if (leftHeight === -1){
                return -1;
            }

            const rightHeight = getHeight(node.right);
            if (rightHeight === -1){
                return -1;
            }

            if (Math.abs(leftHeight - rightHeight) > 1){
                return -1;
            }

            return Math.max(leftHeight, rightHeight) + 1
        }
        return getHeight(this.root) !== -1;
    };
    rebalance(){
        const nodes = [];
        this.inOrder(node => nodes.push(node.data));

        const sortedArray = Array.from(new Set(nodes)).sort((a, b) => a - b);

        this.root = this.buildTree(sortedArray);
    };
}

function generateNumbers(n){
    const randomNumbers = [];
    for (let i = 0; i < n; i++){
        randomNumbers.push(Math.floor(Math.random() * 100));
    }
    return randomNumbers;
}

const numbers = generateNumbers(10);
const bst = new Tree(numbers);

console.log("Is balanced?", bst.isBalanced());
console.log("Level order:", bst.levelOrder());
console.log("In order:", bst.inOrder());
console.log("Pre order:", bst.preOrder());
console.log("Post order:", bst.postOrder());

bst.insert(105);
bst.insert(110);

console.log("Is balanced?", bst.isBalanced());

bst.rebalance();

console.log("Is balanced?", bst.isBalanced());
console.log("Level order:", bst.levelOrder());
console.log("In order:", bst.inOrder());
console.log("Pre order:", bst.preOrder());
console.log("Post order:", bst.postOrder());