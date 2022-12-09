#!/bin/bash
#
# init.sh
#
# Automate these steps to get yourself up and running with PMGuides:
# * Create boilerplate for PMGuides
# * Configure a nodemon watch command to rebuild your pmguide on save
# - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + - + -

command_exists() {
    # check if command exists and fail otherwise
    command -v "$1" >/dev/null 2>&1
    if [[ $? -ne 0 ]]; then
        echo "Note: $1 Does not exist. Please install it first!"
    fi
}

cd `dirname $0`

# validate that a pmguide name was included as an argument
if [ "$#" -ne 1 ]; then
	echo "USAGE: npm run template <PMGUIDE_NAME>"
	echo ""
	exit 1
fi

# env variables
PMGUIDE_NAME=`echo $1 | tr '[:upper:]' '[:lower:]' | tr ' ' '_'`
AUTHOR_NAME=`git config user.name`

# local variables
pmguide_markdown_filename="pmguides/src/$PMGUIDE_NAME/$PMGUIDE_NAME.md"
markdown_template="pmguides/src/_template/markdown.template"
#in MacOS sed creates a backup file if zero length extension is not specified e.g. ''
backup_md="$pmguide_markdown_filename-e"

# validate that markdown template exist
if [ ! -f "$markdown_template" ]; then
  msg "ERROR!"
  echo "Could not find one of the following files:"
  echo "  - $markdown_template"
  echo ""
  exit 0
fi

# Create a new directory for the pmguide 
mkdir pmguides/src/$PMGUIDE_NAME
cp -r pmguides/src/_template/* pmguides/src/$PMGUIDE_NAME/

# rename markdown template file 
mv pmguides/src/$PMGUIDE_NAME/markdown.template $pmguide_markdown_filename

# replace placeholder pmguide id in markdown template file with name provided by command line argument 
sed -i \
  -e "s/PMGUIDE_NAME.*/$PMGUIDE_NAME/g" \
  $pmguide_markdown_filename

# replace placeholder authorname with git username=
sed -i \
  -e "s/AUTHOR_NAME.*/$AUTHOR_NAME/g" \
  $pmguide_markdown_filename

# replace placeholder pmguide name in the watch command with name provided in command line argument
if [ -f "$backup_md" ]; then
  rm $backup_md
fi

echo "Markdown file created! Find it at $PWD/pmguides/src/$PMGUIDE_NAME"

command_exists claat
command_exists go