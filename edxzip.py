import zipfile
import os


def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file))

if __name__ == '__main__':
    zipf = zipfile.ZipFile('python_lib.zip', 'w', zipfile.ZIP_DEFLATED)
    zipf.write('sketchresponse.py')
    zipdir('grader_lib/', zipf)
    zipf.close()
