# edX Quick Start Guide to Deploying SketchResponse Problems

This document is a brief guide on how to use SketchResponse with edX. There are two sets of information that you need to deploy:

1. the python grader library that support your grading scripts
2. the problem XML (which will include your grading scripts).

## Uploading the Grader Library

1. Run the following command from the root of the SketchResponse repository:

   ```sh
   $ python edxzip.py
   ```

   This will create a zip archive called `python_lib.zip` in the root directory of the repository.

2. In edX Studio, from the "Content" menu at the top of the page, select "Files & Uploads".
3. Click the green "+ Upload New File" button and upload the `python_lib.zip` file.

### Notes

If your workflow involves importing an XML course, you may still need to follow these steps in Studio; `python_lib.zip` may not be detected automatically in the static/ folder of your course. The steps are not required every time you upload your course, though; `python_lib.zip` won't be deleted by course uploads.

## Creating SketchResponse problems

1. Create a new Advanced Problem in Studio (or a <problem> if authoring in XML).
2. Use the following problem template, replacing the appropriate sections with your own content:

```xml
    <problem>
    <p>Replace this text with your own problem description.</p>

    <script type="loncapa/python"><![CDATA[

    # Include your grading script here (beginning with import sketchresponse)

    ]]></script>

    <customresponse cfn="grader" expect="See solution.">
        <jsinput width="800" height="550" gradefn="getGrade" get_statefn="getState" set_statefn="setState" html_file="https://sketch-response.surge.sh/sketch-tool/v1/index.html#$problemconfig" sop="false"/>
    </customresponse>


    <solution>

    <p>Provide the solution to your problem here. You may want to include an image of a correct solution as well as text.</p>

    </solution>


    </problem>
```

### Notes

Unlike most other input types, you cannot combine SketchResponse problems with other input types (or other SketchResponse inputs) in a single <problem> tag; doing so will lead to students losing attempts and other unexpected behavior.


