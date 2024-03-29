## This project has been archived and is now available along with all documentation at https://code.usgs.gov/WiM/STNWeb.

![WiM](wimlogo.png)


# STNWeb

Data Management System for Short Term Network.

### Prerequisites

##### required software
[node.js](http://nodejs.org)  
[git](https://git-scm.com/)  

Install global dependencies
```
npm install -g bower
npm install -g gulp
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

https://help.github.com/articles/cloning-a-repository/

Inside of your project folder (after git fork and clone):
```
npm install
bower install
```
## Building and testing

To run the debugging 'watch' script for this repo, run 'gulp watch-dev'

## Deployment
'gulp build-app-dev' will build a dev folder
'gulp build-app-prod' will build a dist folder

## Built With

* [AngularJS](https://angularjs.org/) - The main web framework used
* [NPM](https://www.npmjs.com/) - Dependency Management

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the process for submitting pull requests to us. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on adhering by the [USGS Code of Scientific Conduct](https://www2.usgs.gov/fsp/fsp_code_of_scientific_conduct.asp).

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](../../tags). 

Advance the version when adding features, fixing bugs or making minor enhancement. Follow semver principles. To add tag in git, type git tag v{major}.{minor}.{patch}. Example: git tag v2.0.5

To push tags to remote origin: `git push origin --tags`

*Note that your alias for the remote origin may differ.

## Authors

* **[Lauren Privette](https://www.usgs.gov/staff-profiles/lauren-privette)**  - *Point of Contact* - [USGS Web Informatics & Mapping](https://wim.usgs.gov/)
* **[Tonia Roddick](https://github.com/troddick)**  - *Developer*

See also the list of [contributors](../../graphs/contributors) who participated in this project.

## License

This project is licensed under the Creative Commons CC0 1.0 Universal License - see the [LICENSE.md](LICENSE.md) file for details

## Suggested Citation
In the spirit of open source, please cite any re-use of the source code stored in this repository. Below is the suggested citation:

`This project contains code produced by the Web Informatics and Mapping (WIM) team at the United States Geological Survey (USGS). As a work of the United States Government, this project is in the public domain within the United States. https://wim.usgs.gov`


## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration Note 

## About WIM
* This project authored by the [USGS WIM team](https://wim.usgs.gov)
* WIM is a team of developers and technologists who build and manage tools, software, web services, and databases to support USGS science and other federal government cooperators.
* WIM is a part of the [Upper Midwest Water Science Center](https://www.usgs.gov/centers/wisconsin-water-science-center).
