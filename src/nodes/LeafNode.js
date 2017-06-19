define(function () {

    // https://gamedev.stackexchange.com/questions/40519/how-do-dialog-trees-work
    // A node is universal. For every sentence, a node will exist in memory, ready to be used for whatever purpose.
    var LeafNode = function (data, isRoot) {

        // Sanitize - Let us make the assumption that all text must be set. For automated events, you may wish to handle these elsewhere.
        if (!data.text)
            throw "- Node would be redundant (are you passing any data?)";

        this.id = data.id;
        this.text = data.text;

        // Collections
        this.linked = data.linked;
        this.actions = data.actions;

        // If a choice node, may wish to treat differently (user input for instance)
        this.isRoot = isRoot;
        this.hasChoice = this.linked.length > 1;
        this.isEnd = this.linked.length === 0;

        // Origin will be a previous node that this node connected to, it optional however
        this.origin = [];

        // Internal, used for locking the current node to prevent overwrite
        this.isCurrent = false;

    };

    LeafNode.prototype.Current = function () {
        return this.isCurrent;
    };

    LeafNode.prototype.SetOrigin = function (node) {
        this.origin.push(node);
    };

    LeafNode.prototype.Enter = function () {
        this.isCurrent = true;
        return this;
    };

    LeafNode.prototype.Exit = function (choice) {
        this.isCurrent = false;
        return this;
    };

    return LeafNode;

});