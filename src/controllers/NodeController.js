define(['LeafNode'], function (LeafNode) {

    var NodeController = function () {

        // Only one node can be active at a time in the stream.
        this.activeNode = null;
        this.nodes = [];
        this.onComplete = null;

        return this;

    };

    NodeController.prototype.FindNode = function (id) {

        return this.nodes.find(function (item) {
            return item.id === id;
        });

    };

    // NodeController data parser (public facing)
    NodeController.prototype.ParseData = function (data, cb, linkOrigin) {

        let self = this;

        // Purge existing nodes ( we do it here for a slight performance gain )
        this.nodes = [];

        // Map new nodes from data
        this.nodes = data.map(function (nodeData, i) {
            return new LeafNode(nodeData, i === 0);
        });

        // After-binding history (optional, if you never intend to know the origin then don't bother with it)
        if (linkOrigin) {
            this.nodes.forEach(function (node) {
                node.linked.forEach(function (id) {
                    let ch = self.FindNode(id);
                    if (!ch)
                        throw "- A node of ID " + id + " could not be located.";
                    ch.SetOrigin(node);
                    if (node.hasChoice)
                        ch.isChoice = true;
                });
            });
        }

        // and callback
        if (typeof cb === 'function')
            this.onComplete = cb;

        return this;

    };

    // NodeController access (public facing)
    NodeController.prototype.Start = function () {

        this.started = true;
        this.activeNode = this.nodes[0];
        this.activeNode.Enter();

        return [this.activeNode];

    };

    NodeController.prototype.Answer = function (choice) {

        if (!this.started)
            return;

        choice = choice ? choice : 0;

        if (choice > this.activeNode.linked.length - 1)
            throw "- Choice index was out of range.";

        this.activeNode.Exit();
        this.activeNode = this.FindNode(this.activeNode.linked[choice]);
        this.activeNode.Enter();

        return [this.activeNode];

    };

    NodeController.prototype.Next = function () {

        if (this.activeNode && this.activeNode.isEnd && this.onComplete) {
            this.onComplete({
                "duh": "blooo"
            });
            return;
        }

        if (!this.started)
            return;

        this.started = !this.activeNode.isEnd;

        let self = this;
        let collection = this.activeNode.linked.map(function (id) {
            return self.FindNode(id);
        });

        if (collection.length > 1) {

            return collection;

        } else {

            this.activeNode.Exit();
            this.activeNode = collection[0];
            this.activeNode.Enter();

            return [this.activeNode];

        }

    };

    return new NodeController();

});