# Landscape of Product Models

You can find the GitHub Pages Website under [https://earlgreyaroma.github.io/model-landscape](https://earlgreyaroma.github.io/model-landscape).

## Description

This map represents the landscape of product models in embodiment design, a visualization of the product models currently used in embodiment design and the links between them. Each gray node represents a product model, each green node represents an input or output that appeared multiple times and was therefore considered a category, and each edge represents an identified link. The map was created using the [Gephi network visualization software](https://gephi.org/), and the layout was calculated using the force-directed Yifan Hu layout algorithm. The data of the map and its associated information are based on the systematic literature review by Paehler, L., & Matthiesen, S. (2024). Mapping the landscape of product models in embodiment design. Research in Engineering Design.{" "} [https://doi.org/10.1007/s00163-024-00433-x](https://doi.org/10.1007/s00163-024-00433-x).For more information on the map, its literature, or other aspects of its background, please refer to this publication.

## Download Source Code from GitHub

To download the source code, make sure you have the following installed:

-   [git](https://git-scm.com/downloads)
-   [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

If you are on Windows, you might prefer to setup a [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) (Windows Subsystem for Linux) instance for easily handling these commands in your terminal. For the following guide, I will expect that you have WSL installed.

Also make sure you have setup an [SSH key on your github](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) account.

1. Create a new directory to store the repo source code and navigate to it.

```bash
mkdir Git
cd Git
```

2. Clone this repository using SSH

```bash
git clone git@github.com:earlgreyaroma/model-landscape.git
```

3. Install all the necassary packages.

```bash
npm install
```

## Upload Website and Source Code to GitHub

If you simply want to update this existing repository jump to 4.

1. Create a new GitHub repository on your GitHub account and copy the SSH Url.

2. In your cloned repository directory, change the remote URL to your new repository URL using SSH:

```bash
git remote set-url origin <url>
```

3. Make sure to change the `homepage` value in `package.json` to your new GitHub Pages URL. eg.:

`package.json`

```json
"homepage": "https://{gitname}.github.io/{repo}",
```

4. Deploy your website.

```bash
npm run deploy
```

This will automatically build your website and upload it to your GitHub repo in a branch called `gh-pages`.

**Optionally**

5. Upload your source code:

```bash
git add .
git commit -m "Edited Source Code"
git push origin main
```

## Edit the Graph Data

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

## Activate the Node Description in Modal

As of right now, the description paragraph in the modal of each node when clicked is deactivated. To activate the description navigate to `./src/components/ui/Modal.jsx` and un-comment (remove `{/*` and `*/}`) the description `div`:

```html
{/*
<div className="modal-description">
    <h4>Description</h4>
    <p>{node.attributes.Description}</p>
</div>
*/}
```

The description is saved in gephi.json. It is declared as an attribute in [gephi](https://gephi.org/).
