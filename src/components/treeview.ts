import "./treeview.scss";
var templateEditorHtml = require("html-loader?interpolate!val-loader!./treeview.html");

export interface ITreeNodeItem {
  name: string;
  title?: string;
  hasItems: boolean;
}

export class TreeViewNodeItem {
  constructor(
    private path: string[],
    private _data: ITreeNodeItem,
    itemsProvider: (path: string[]) => ITreeNodeItem[],
    private clickHandler: (item: ITreeNodeItem) => void
  ) {
    var self = this;
    var loadSubscr = this.isExpanded.subscribe(expanded => {
      if (expanded) {
        var thisPath = path.concat(self.name);
        self.items(
          itemsProvider(thisPath).map(item => {
            return new TreeViewNodeItem(
              thisPath,
              item,
              itemsProvider,
              clickHandler
            );
          })
        );
        loadSubscr.dispose();
      }
    });
    this.isExpanded(path.length === 0);
  }
  get name() {
    return this._data.name;
  }
  get title() {
    return this._data.title || this._data.name;
  }
  get hasItems() {
    return this._data.hasItems;
  }
  items = ko.observableArray();
  isExpanded = ko.observable(false);
  toggle(model: TreeViewNodeItem) {
    model.isExpanded(!model.isExpanded());
  }
  click(model: TreeViewNodeItem) {
    model.clickHandler(model);
  }
  get padding() {
    return 20 * this.path.length + "px";
  }
}

debugger;
ko.components.register("svd-tree-view", {
  viewModel: {
    createViewModel: function(params, componentInfo) {
      return new TreeViewNodeItem(
        [],
        <any>{},
        params.itemsProvider,
        params.clickHandler
      );
    }
  },
  template: templateEditorHtml
});
