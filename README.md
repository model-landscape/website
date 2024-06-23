# Graph Data

To change the data displayed in the graph, you can edit the following files in `./public`:

```bash
/gephi.json         # graph data extracted from gephi
/gephiIO.yaml       # additional graph data
/generalInfo.json   # general information about the data
```

`gephi.json` is the exported network graph data from [gephi](https://gephi.org/). Typically no change is needed to the file prior to copying it inside the `/public` directory.
If you have made changes to the graph and exported a new file from gephi, simply switch the new file with the old in the before mentioned directory.

`gephiIO.yaml` includes a list of additional data for the individual nodes provided by the gephi.json. This includes references, inputs and outputs.
The general structure of these yaml objects looks like this:

```yaml
- node: "node ID from gephi.json"
  references:
      - "Authors Year"
  inputs:
      - "Input 1"
  outputs:
      - "Output 1"
```

If you update your `gephi.json` make sure that you also check your `gephiIO.yaml` und update this file manually if necessary.

`generalInfo.json` includes general information about this data and website. As of right now it only contains the full references to the scientific papers used to create this graph/model.

If you want to change the general description, legals or contact navigate to `./src/pages/Home.jsx` and change the text inside the `<p></p>`-tags.

# Activate Description in Pop Up

As of right now, the description paragraph in the pop up of each node when clicked is deactivated. To activate the description navigate to `./src/components/ui/Modal.jsx` and un-comment (remove `{/*` and `*/}`) the description `div`:

```javascript
...
<div className="modal-content">
                    <h3 className="modal-heading">{node.label}</h3>
                    <CloseButton onClose={onClose} />
                    {/*
                    <div className="modal-description">
                    <h4>Description</h4>
                    <p>{node.attributes.Description}</p>
                    </div>
                    */}
                    <div className="modal-inputs">
                        <h4>Inputs</h4>
...
```

The description is saved in gephi.json. It is declared as an attribute in [gephi](https://gephi.org/).
