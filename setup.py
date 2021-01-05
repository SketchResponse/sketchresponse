import setuptools

root_package = 'sketchresponse'
packages = [root_package]
packages += [root_package + '.' + package for package in setuptools.find_packages()]

setuptools.setup(
    name='sketchresponse',
    version='1.5.3',
    packages=packages,
    package_dir={root_package: '.'},
    install_requires=[
    	'numpy',
    	'sympy',
    ]
)
