import json
import os
import unittest

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains


class TestPointPlugin(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        chromedriver = '/usr/bin/chromedriver'
        os.environ['webdriver.chrome.driver'] = chromedriver
        # https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities
        capabilities = {
            'platform': 'ANY',
            'browserName': 'chrome',
            'version': ''
        }
        self.driver = webdriver.Chrome(desired_capabilities=capabilities)
        self.driver.implicitly_wait(5)

    @classmethod
    def setUp(self):
        self.driver.get('localhost:4567#debug:config1')
        self.canvas = self.driver.find_element_by_css_selector("#si-canvas")
        self.actions = ActionChains(self.driver)
        # Click point plugin button in toolbar to activate it
        # Not really necessary for this plugin, as it is activated by default but things may change
        self.click_toolbar_button(self, 'cp')

    def test_creation_selection_deletion_grading(self):
        # Create a points on the canvas.
        self.create_point(100, 150)
        # Check that the actual SVG node has been created
        xpath = '//*[name()="svg"]/*[name()="g"]/*[name()="circle"]'
        self.assertTrue(self.element_is_present_by_xpath(xpath))
        # Check that the grading function returns correct data
        grade_str = self.driver.execute_script("return getGrade()")
        grade = json.loads(grade_str)
        point = grade['data']['cp'][0]['point']
        self.assertTrue(point[0] == 100)
        self.assertTrue(point[1] == 150)
        # Select the newly created point and check that it has the correct selected attribute
        self.click_toolbar_button('select')
        point = self.driver.find_element_by_xpath(xpath)
        self.actions.click(point)
        self.actions.perform()
        self.assertTrue(point.get_attribute('data-si-selected') is not None)
        # Delete the point and check it has been effectively removed from DO
        self.click_toolbar_button('delete')
        self.assertFalse(self.element_is_present_by_xpath(xpath))
        # Check that the grading function returns correct data ie empty list
        grade_str = self.driver.execute_script("return getGrade()")
        grade = json.loads(grade_str)
        self.assertTrue(not grade['data']['cp'])

    def click_toolbar_button(self, id):
        button = self.driver.find_element_by_css_selector('#si-toolbar > #%s > button' % id)
        button.click()

    def create_point(self, x=0, y=0):
        self.actions.move_to_element_with_offset(self.canvas, x, y)
        self.actions.click()
        self.actions.perform()

    def element_is_present_by_xpath(self, xpath):
        try:
            self.driver.find_element_by_xpath(xpath)
        except NoSuchElementException:
            return False
        return True

    @classmethod
    def tearDown(self):
        self.driver.quit()

if __name__ == '__main__':
    unittest.main()
