$(function () {
    var path,
        axes,
        directionhint,
        deadzone = 25, // pixels
        minpathlength = 2, // pixels
        drawingtool = new paper.Tool(),
        drawing = false,
        undostack = [],
        redostack = [];

    paper.setup('sketchCanvas');

    axes = new paper.Raster({
        source: window.location.hash.slice(1) || 'axes.png',
        position: paper.view.center
    });

    directionhint = new paper.Path.Line({
        strokeColor: 'lightgrey',
        strokeWidth: 2,
        visible: false
    });

    drawingtool.onMouseDown = function(event) {
        if (drawing) {
            // This happens when we drag off the screen onto browser chrome and
            // then need to click to trigger our mouseup when we return to the canvas.
            // We return here to avoid overwriting 'path' with a new value.
            return;
        }

        drawing = true;
        path = new paper.Path();
        path.strokeColor = 'blue';
        path.strokeWidth = '3';
        path.add(event.point);
    };

    drawingtool.onMouseMove = function(event) {
        if (!drawing) {
            return;
        }

        var lastPoint = path.lastSegment.point,
            vector = event.point.subtract(lastPoint);

        $('#sketchCanvas').css('cursor', 'none');

        directionhint.segments[0].point = lastPoint;
        directionhint.segments[1].point = event.point;
        directionhint.visible = true;

        if (vector.length > deadzone) {
            path.add(lastPoint.add(vector.normalize().multiply(vector.length - deadzone)));
        }
    };

    // NOTE: we're not passing the expected event argument into here since we sometimes
    // trigger this function manually (on $('#sketchCanvas').mouseout)
    drawingtool.onMouseUp = function() {
        drawing = false;
        $('#sketchCanvas').css('cursor', 'inherit');
        directionhint.visible = false;
        path.simplify(5);

        // Only keep the path if it's long enough
        // (also prevents simple clicks on canvas from creating anything)
        if (path.length >= minpathlength) {
            undostack.push(path);
            redostack = [];
        } else {
            path.remove();
        }
    };

    $('#sketchCanvas').mouseout(function () {
        if (drawing) {
            // artifically trigger mouseup behavior if we leave the canvas
            drawingtool.onMouseUp();
        }
    });

    $(document).mouseenter(function () {
        window.focus(); // so we get keyboard events
    });

    $(document).keydown(function (event) {
        var currentpath;

        if (event.ctrlKey && event.which == 90 && undostack.length > 0) {
            currentpath = undostack.pop();
            redostack.push(currentpath);
            currentpath.remove();
            paper.view.draw();
        }

        if (event.ctrlKey && event.which == 89 && redostack.length > 0) {
            currentpath = redostack.pop();
            undostack.push(currentpath);
            paper.project.activeLayer.addChild(currentpath);
            paper.view.draw();
        }
    });

    function gradefn() {
        var container = document.createElement('div');
        var svgdom = paper.project.exportSVG();
        $('image', svgdom).remove(); // Get rid of background image node (don't need to grade)
        container.appendChild(svgdom);
        return container.innerHTML;
    }

    function get_statefn() {
        var pathexports = [];
        undostack.forEach(function (pathobj) {
            pathexports.push(pathobj.exportJSON());
        });
        return JSON.stringify(pathexports);
    }

    function set_statefn(statestring) {
        var pathexports;
        pathexports = JSON.parse(statestring);
        pathexports.forEach(function (pathjson) {
            var pathobj = paper.Path.importJSON(pathjson);
            undostack.push(pathobj);
            paper.project.activeLayer.addChild(pathobj);
            paper.view.draw();
        });
    }

    // bind our global object
    window.sketchinput = {
        gradefn: gradefn,
        get_statefn: get_statefn,
        set_statefn: set_statefn
    };
});
