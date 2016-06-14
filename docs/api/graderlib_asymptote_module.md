## grader_lib.Asymptote module[¶](submodules.md#module-grader_lib.Asymptote) {#grader-lib-asymptote-module}

*   _class_ `grader_lib.Asymptote.``Asymptotes`(_info_, _tolerance={}_)[¶](#grader_lib.Asymptote.Asymptotes)
*   Bases: `grader_lib.Gradeable.Gradeable`

    Asymptote.

    Note

    Asymptotes is a generic class. You must instantiate either the VerticalAsymptotes or the HorizontalAsymptotes class to use the grading functions below.

    *   `closest_asym_to_value`(_v_)[¶](#grader_lib.Asymptote.Asymptotes.closest_asym_to_value)
    *   Return the absolute distance between v and the closest asymptote and the x or y axis value of that asymptote.

        | Parameters: | **v** – a value in the range of the x or y axis. |
        | --- | --- |
        | Returns: | 

        *   minDistance: the absolute difference between v and the asymptote,
        *   or float(‘inf’) if no asymptote exists.
        *   closestAsym: the value of the closest asymptote to the value v,
        *   or None if no asymptote exists.

         |
        | Return type: | float, float |

    *   `get_asym_at_value`(_v_)[¶](#grader_lib.Asymptote.Asymptotes.get_asym_at_value)
    *   Return the asymptote at the value v, or None.

        | Parameters: | **v** – a value in the range of the x or y axis. |
        | --- | --- |
        | Returns: | the value of an asymptote that is within tolerances of the value v, or None if no such asymptote exists. |
        | Return type: | float |

    *   `get_number_of_asyms`()[¶](#grader_lib.Asymptote.Asymptotes.get_number_of_asyms)
    *   Return the number of asymptotes declared in the function.

        | Returns: | the number of asymptotes declared in the function. |
        | --- | --- |
        | Return type: | int |

    *   `has_asym_at_value`(_v_)[¶](#grader_lib.Asymptote.Asymptotes.has_asym_at_value)
    *   Return whether an asymtote is declared at the given value.

        | Parameters: | **v** – a value in the range of the x or y axis. |
        | --- | --- |
        | Returns: | true if there is an asymptote declared within tolerances of the value v, or false otherwise. |
        | Return type: | bool |

*   _class_ `grader_lib.Asymptote.``HorizontalAsymptotes`(_info_)[¶](#grader_lib.Asymptote.HorizontalAsymptotes)
*   Bases: [`grader_lib.Asymptote.Asymptotes`](#grader_lib.Asymptote.Asymptotes)

    Horizontal Asymptote.

    Note

    Use this class to interact with any horizontal asymptotes in the function you are grading.

*   _class_ `grader_lib.Asymptote.``VerticalAsymptotes`(_info_)[¶](#grader_lib.Asymptote.VerticalAsymptotes)
*   Bases: [`grader_lib.Asymptote.Asymptotes`](#grader_lib.Asymptote.Asymptotes)

    Vertical Asymptote.

    Note

    Use this class to interact with any vertical asymptotes in the function you are grading.